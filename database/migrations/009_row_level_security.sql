-- ============================================================================
-- CivicFix Database Migration: 009_row_level_security.sql
-- Phase: Day 4 Database Architecture
-- Purpose: Enable Row Level Security (RLS) on all 14 tables and define explicit policies
-- ============================================================================

-- ============================================================================
-- 1. Enable RLS on all 14 Application Tables
-- ============================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE resolution_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. Policies: profiles
-- ============================================================================
DROP POLICY IF EXISTS "profiles_select_all_authenticated" ON profiles;
CREATE POLICY "profiles_select_all_authenticated"
ON profiles FOR SELECT
TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "profiles_update_own_record" ON profiles;
CREATE POLICY "profiles_update_own_record"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ============================================================================
-- 3. Policies: organizations
-- ============================================================================
DROP POLICY IF EXISTS "organizations_select_active" ON organizations;
CREATE POLICY "organizations_select_active"
ON organizations FOR SELECT
TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "organizations_modify_platform_admin_only" ON organizations;
CREATE POLICY "organizations_modify_platform_admin_only"
ON organizations FOR ALL
TO authenticated
USING (public.is_platform_admin(auth.uid()))
WITH CHECK (public.is_platform_admin(auth.uid()));

-- ============================================================================
-- 4. Policies: departments
-- ============================================================================
DROP POLICY IF EXISTS "departments_select_active" ON departments;
CREATE POLICY "departments_select_active"
ON departments FOR SELECT
TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "departments_modify_org_admin" ON departments;
CREATE POLICY "departments_modify_org_admin"
ON departments FOR ALL
TO authenticated
USING (
  public.has_org_role(organization_id, auth.uid(), 'ORG_ADMIN') OR
  public.is_platform_admin(auth.uid())
)
WITH CHECK (
  public.has_org_role(organization_id, auth.uid(), 'ORG_ADMIN') OR
  public.is_platform_admin(auth.uid())
);

-- ============================================================================
-- 5. Policies: staff_memberships
-- ============================================================================
DROP POLICY IF EXISTS "staff_memberships_select_own_or_org" ON staff_memberships;
CREATE POLICY "staff_memberships_select_own_or_org"
ON staff_memberships FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  public.is_org_member(organization_id, auth.uid()) OR
  public.is_platform_admin(auth.uid())
);

DROP POLICY IF EXISTS "staff_memberships_modify_org_admin" ON staff_memberships;
CREATE POLICY "staff_memberships_modify_org_admin"
ON staff_memberships FOR ALL
TO authenticated
USING (
  public.has_org_role(organization_id, auth.uid(), 'ORG_ADMIN') OR
  public.is_platform_admin(auth.uid())
)
WITH CHECK (
  public.has_org_role(organization_id, auth.uid(), 'ORG_ADMIN') OR
  public.is_platform_admin(auth.uid())
);

-- ============================================================================
-- 6. Policies: complaint_categories
-- ============================================================================
DROP POLICY IF EXISTS "categories_select_active" ON complaint_categories;
CREATE POLICY "categories_select_active"
ON complaint_categories FOR SELECT
TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "categories_modify_admin" ON complaint_categories;
CREATE POLICY "categories_modify_admin"
ON complaint_categories FOR ALL
TO authenticated
USING (
  (organization_id IS NOT NULL AND public.has_org_role(organization_id, auth.uid(), 'ORG_ADMIN')) OR
  public.is_platform_admin(auth.uid())
)
WITH CHECK (
  (organization_id IS NOT NULL AND public.has_org_role(organization_id, auth.uid(), 'ORG_ADMIN')) OR
  public.is_platform_admin(auth.uid())
);

-- ============================================================================
-- 7. Policies: complaints
-- ============================================================================
DROP POLICY IF EXISTS "complaints_select_policy" ON complaints;
CREATE POLICY "complaints_select_policy"
ON complaints FOR SELECT
TO authenticated
USING (
  -- 1. Citizen sees own submitted complaints
  citizen_id = auth.uid() OR
  -- 2. Staff in the organization can view complaints
  public.is_org_member(organization_id, auth.uid()) OR
  -- 3. Publicly verified/active complaints visible in organization
  (status NOT IN ('SUBMITTED', 'REJECTED', 'DUPLICATE')) OR
  -- 4. Platform administrators
  public.is_platform_admin(auth.uid())
);

DROP POLICY IF EXISTS "complaints_insert_citizen_only" ON complaints;
CREATE POLICY "complaints_insert_citizen_only"
ON complaints FOR INSERT
TO authenticated
WITH CHECK (
  citizen_id = auth.uid() AND
  status = 'SUBMITTED'
);

DROP POLICY IF EXISTS "complaints_update_policy" ON complaints;
CREATE POLICY "complaints_update_policy"
ON complaints FOR UPDATE
TO authenticated
USING (
  -- Citizen can update only while still SUBMITTED (e.g. typos, additional details)
  (citizen_id = auth.uid() AND status = 'SUBMITTED') OR
  -- Staff members in organization
  public.is_org_member(organization_id, auth.uid()) OR
  public.is_platform_admin(auth.uid())
)
WITH CHECK (
  (citizen_id = auth.uid() AND status = 'SUBMITTED') OR
  public.is_org_member(organization_id, auth.uid()) OR
  public.is_platform_admin(auth.uid())
);

-- ============================================================================
-- 8. Policies: complaint_attachments
-- ============================================================================
DROP POLICY IF EXISTS "attachments_select_policy" ON complaint_attachments;
CREATE POLICY "attachments_select_policy"
ON complaint_attachments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM complaints c
    WHERE c.id = complaint_attachments.complaint_id
      AND (
        c.citizen_id = auth.uid() OR
        public.is_org_member(c.organization_id, auth.uid()) OR
        public.is_platform_admin(auth.uid())
      )
  )
);

DROP POLICY IF EXISTS "attachments_insert_policy" ON complaint_attachments;
CREATE POLICY "attachments_insert_policy"
ON complaint_attachments FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM complaints c
    WHERE c.id = complaint_attachments.complaint_id
      AND (
        c.citizen_id = auth.uid() OR
        public.is_org_member(c.organization_id, auth.uid())
      )
  )
);

-- ============================================================================
-- 9. Policies: complaint_assignments
-- ============================================================================
DROP POLICY IF EXISTS "assignments_select_policy" ON complaint_assignments;
CREATE POLICY "assignments_select_policy"
ON complaint_assignments FOR SELECT
TO authenticated
USING (
  assigned_to = auth.uid() OR
  public.is_org_member(organization_id, auth.uid()) OR
  public.is_platform_admin(auth.uid())
);

DROP POLICY IF EXISTS "assignments_modify_supervisors" ON complaint_assignments;
CREATE POLICY "assignments_modify_supervisors"
ON complaint_assignments FOR ALL
TO authenticated
USING (
  public.has_org_role(organization_id, auth.uid(), 'SUPERVISOR') OR
  public.is_platform_admin(auth.uid())
)
WITH CHECK (
  public.has_org_role(organization_id, auth.uid(), 'SUPERVISOR') OR
  public.is_platform_admin(auth.uid())
);

-- ============================================================================
-- 10. Policies: complaint_status_history (IMMUTABLE AUDIT)
-- ============================================================================
DROP POLICY IF EXISTS "status_history_select_policy" ON complaint_status_history;
CREATE POLICY "status_history_select_policy"
ON complaint_status_history FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM complaints c
    WHERE c.id = complaint_status_history.complaint_id
      AND (
        c.citizen_id = auth.uid() OR
        public.is_org_member(c.organization_id, auth.uid()) OR
        public.is_platform_admin(auth.uid())
      )
  )
);

-- Ordinary UPDATE and DELETE are strictly forbidden to ensure immutability
DROP POLICY IF EXISTS "status_history_no_update" ON complaint_status_history;
CREATE POLICY "status_history_no_update"
ON complaint_status_history FOR UPDATE
TO authenticated
USING (false);

DROP POLICY IF EXISTS "status_history_no_delete" ON complaint_status_history;
CREATE POLICY "status_history_no_delete"
ON complaint_status_history FOR DELETE
TO authenticated
USING (false);

-- ============================================================================
-- 11. Policies: complaint_comments (INTERNAL NOTES PROTECTION)
-- ============================================================================
DROP POLICY IF EXISTS "comments_select_policy" ON complaint_comments;
CREATE POLICY "comments_select_policy"
ON complaint_comments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM complaints c
    WHERE c.id = complaint_comments.complaint_id
      AND (
        -- 1. Citizens can view ONLY CITIZEN_VISIBLE comments on their complaint
        (c.citizen_id = auth.uid() AND complaint_comments.visibility = 'CITIZEN_VISIBLE') OR
        -- 2. Staff members in the organization can view BOTH citizen-visible AND internal notes
        (public.is_org_member(c.organization_id, auth.uid())) OR
        -- 3. Platform administrators
        public.is_platform_admin(auth.uid())
      )
  )
);

DROP POLICY IF EXISTS "comments_insert_policy" ON complaint_comments;
CREATE POLICY "comments_insert_policy"
ON complaint_comments FOR INSERT
TO authenticated
WITH CHECK (
  author_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM complaints c
    WHERE c.id = complaint_comments.complaint_id
      AND (
        -- Citizen can only post CITIZEN_VISIBLE comments
        (c.citizen_id = auth.uid() AND visibility = 'CITIZEN_VISIBLE') OR
        -- Staff can post either CITIZEN_VISIBLE or INTERNAL_ONLY notes
        (public.is_org_member(c.organization_id, auth.uid()))
      )
  )
);

-- ============================================================================
-- 12. Policies: resolution_evidence
-- ============================================================================
DROP POLICY IF EXISTS "evidence_select_policy" ON resolution_evidence;
CREATE POLICY "evidence_select_policy"
ON resolution_evidence FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM complaints c
    WHERE c.id = resolution_evidence.complaint_id
      AND (
        -- Citizens see evidence once complaint is resolved/closed
        (c.citizen_id = auth.uid() AND c.status IN ('RESOLVED', 'CLOSED')) OR
        public.is_org_member(c.organization_id, auth.uid()) OR
        public.is_platform_admin(auth.uid())
      )
  )
);

DROP POLICY IF EXISTS "evidence_insert_staff_only" ON resolution_evidence;
CREATE POLICY "evidence_insert_staff_only"
ON resolution_evidence FOR INSERT
TO authenticated
WITH CHECK (
  submitted_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM complaints c
    WHERE c.id = resolution_evidence.complaint_id
      AND public.is_org_member(c.organization_id, auth.uid())
  )
);

-- ============================================================================
-- 13. Policies: complaint_feedback
-- ============================================================================
DROP POLICY IF EXISTS "feedback_select_policy" ON complaint_feedback;
CREATE POLICY "feedback_select_policy"
ON complaint_feedback FOR SELECT
TO authenticated
USING (
  citizen_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM complaints c
    WHERE c.id = complaint_feedback.complaint_id
      AND public.is_org_member(c.organization_id, auth.uid())
  ) OR
  public.is_platform_admin(auth.uid())
);

DROP POLICY IF EXISTS "feedback_insert_citizen_only" ON complaint_feedback;
CREATE POLICY "feedback_insert_citizen_only"
ON complaint_feedback FOR INSERT
TO authenticated
WITH CHECK (
  citizen_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM complaints c
    WHERE c.id = complaint_feedback.complaint_id
      AND c.citizen_id = auth.uid()
      AND c.status IN ('RESOLVED', 'CLOSED')
  )
);

-- ============================================================================
-- 14. Policies: notifications
-- ============================================================================
DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own"
ON notifications FOR SELECT
TO authenticated
USING (recipient_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own"
ON notifications FOR UPDATE
TO authenticated
USING (recipient_id = auth.uid())
WITH CHECK (recipient_id = auth.uid());

-- ============================================================================
-- 15. Policies: audit_logs (IMMUTABLE GOVERNANCE TRAIL)
-- ============================================================================
DROP POLICY IF EXISTS "audit_logs_select_admin_only" ON audit_logs;
CREATE POLICY "audit_logs_select_admin_only"
ON audit_logs FOR SELECT
TO authenticated
USING (
  public.is_platform_admin(auth.uid()) OR
  (organization_id IS NOT NULL AND public.has_org_role(organization_id, auth.uid(), 'ORG_ADMIN'))
);

-- Update and Delete are completely forbidden for everyone
DROP POLICY IF EXISTS "audit_logs_no_update" ON audit_logs;
CREATE POLICY "audit_logs_no_update"
ON audit_logs FOR UPDATE
TO authenticated
USING (false);

DROP POLICY IF EXISTS "audit_logs_no_delete" ON audit_logs;
CREATE POLICY "audit_logs_no_delete"
ON audit_logs FOR DELETE
TO authenticated
USING (false);
