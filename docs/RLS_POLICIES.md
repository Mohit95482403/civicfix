# CivicFix Row Level Security (RLS) Policy Specification

**Document Version:** 2.0.0  
**Phase:** Day 4 — Production-Minded Database Architecture, PostgreSQL Schema, Migrations, RLS & Seed Data  
**Status:** Approved & Implemented Baseline  

---

## 1. Security Philosophy & Threat Model

CivicFix serves citizens, municipal field workers, ward supervisors, municipal administrators, and platform operators across multiple jurisdictions. The core authorization rules implemented at the PostgreSQL layer are:

1. **Multi-Tenant Ward Isolation:** Staff in Municipality A cannot view, inspect, modify, or delegate complaints belonging to Municipality B.
2. **Citizen Data Privacy:** Citizens have read/write access to their own tickets. Unverified tickets (`SUBMITTED`) and draft information are hidden from other citizens.
3. **Internal Note Shielding:** Internal staff deliberations (`visibility = 'INTERNAL_ONLY'`) are strictly invisible to citizens at both the database RLS layer and the API layer.
4. **Immutable Audit Trails:** Complaint lifecycle history (`complaint_status_history`) and compliance audit records (`audit_logs`) reject all `UPDATE` and `DELETE` operations using explicit `USING (false)` policies.
5. **Separation of Platform Superusers:** Platform administrators are decoupled from organization memberships through the `platform_administrators` table and evaluated via security-definer helper functions with fixed search paths.
6. **No Blind Service Role in Clients:** Flutter mobile apps and React web apps only authenticate with anonymous or authenticated user JWTs (`auth.uid()`). The Supabase Service Role key is restricted strictly to backend microservices.

---

## 2. Security Definer Helper Functions

To avoid recursive policy loops and ensure high-performance evaluation, RLS policies leverage four hardened helper functions defined in [database/migrations/008_helper_functions.sql](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/database/migrations/008_helper_functions.sql):

| Function | Signature | Purpose & Security Controls |
| :--- | :--- | :--- |
| `public.is_org_member` | `(p_org_id UUID, p_user_id UUID) -> BOOLEAN` | Checks if user has an active membership in the organization. `SECURITY DEFINER`, `SET search_path = public, pg_temp`. |
| `public.has_org_role` | `(p_org_id UUID, p_user_id UUID, p_required_role staff_role) -> BOOLEAN` | Validates hierarchical staff rank (`ORG_ADMIN` > `SUPERVISOR` > `STAFF`). |
| `public.is_platform_admin`| `(p_user_id UUID) -> BOOLEAN` | Checks membership in `platform_administrators`. Avoids client-editable profile tampering. |
| `public.record_status_transition` | `(p_complaint_id UUID, p_new_status complaint_status, p_changed_by UUID, p_reason TEXT)` | Atomic procedure updating `complaints.status` and appending to `complaint_status_history`. |

---

## 3. Comprehensive Table-by-Table RLS Matrix

All 14 application tables have Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).

| Table Name | RLS Enabled | SELECT Permissions | INSERT Permissions | UPDATE Permissions | DELETE Permissions | Organization Scoping |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `profiles` | **YES** | Active authenticated users | Handled by `handle_new_user()` trigger on `auth.users` | Self only (`id = auth.uid()`) | None (Supabase Auth Cascade only) | Global identity |
| `organizations` | **YES** | All active authenticated users | Platform Admins only | Platform Admins only | Platform Admins only | Multi-tenant root |
| `departments` | **YES** | All active authenticated users | Org Admin of parent Org or Platform Admin | Org Admin of parent Org or Platform Admin | Org Admin of parent Org or Platform Admin | Scoped by `organization_id` |
| `staff_memberships` | **YES** | Self, members of same Org, or Platform Admin | Org Admin of target Org or Platform Admin | Org Admin of target Org or Platform Admin | Org Admin of target Org or Platform Admin | Scoped by `organization_id` |
| `platform_administrators` | **YES** | Platform Admins only | Platform Admins only | Platform Admins only | Platform Admins only | Global governance |
| `complaint_categories` | **YES** | All active authenticated users | Org Admin for Org categories, Platform Admin for global | Org Admin for Org categories, Platform Admin for global | Org Admin for Org categories, Platform Admin for global | Global if Org is NULL; else Org-scoped |
| `complaints` | **YES** | Citizen owner, Org staff, Platform Admin, or public verified tickets | Authenticated citizen only (`citizen_id = auth.uid()` & `status = 'SUBMITTED'`) | Citizen while `SUBMITTED`, Org Staff, or Platform Admin | None (Complaints are preserved) | Strictly isolated by `organization_id` |
| `complaint_attachments` | **YES** | Citizen ticket owner, Org staff, or Platform Admin | Uploader (`uploaded_by = auth.uid()`) on accessible complaints | None (Attachments are immutable) | Platform Admin only | Scoped via parent `complaint.organization_id` |
| `complaint_assignments` | **YES** | Assigned technician, Org staff, or Platform Admin | Org Supervisors, Org Admins, or Platform Admins | Org Supervisors, Org Admins, or Platform Admins | None (Delegation history preserved) | Scoped by `organization_id` |
| `complaint_status_history`| **YES** | Citizen ticket owner, Org staff, or Platform Admin | System / Trusted Backend procedure (`record_status_transition`) | **FORBIDDEN** (`USING (false)`) | **FORBIDDEN** (`USING (false)`) | Scoped via parent `complaint.organization_id` |
| `complaint_comments` | **YES** | Citizen sees `CITIZEN_VISIBLE` on own ticket; Org staff & Platform Admins see both `CITIZEN_VISIBLE` and `INTERNAL_ONLY` | Author (`author_id = auth.uid()`); Citizen restricted to `CITIZEN_VISIBLE`; Staff can post both | None (Discussion history preserved) | None (Preserved for audit) | Scoped via parent `complaint.organization_id` |
| `resolution_evidence` | **YES** | Org staff & Platform Admins; Citizen sees once ticket is `RESOLVED` or `CLOSED` | Active Org Staff member assigned/authorized on ticket | Org Supervisors or Platform Admins (verification) | None | Scoped via parent `complaint.organization_id` |
| `complaint_feedback` | **YES** | Citizen author, Org staff, or Platform Admin | Citizen owner on resolved/closed tickets only | Citizen author only | None | Scoped via parent `complaint.organization_id` |
| `notifications` | **YES** | Recipient only (`recipient_id = auth.uid()`) | System / Backend Service Role | Recipient only (`read_at` update) | Recipient only | User-scoped |
| `audit_logs` | **YES** | Platform Admins or Org Admin of target Org | System / Backend Service Role / Trusted Triggers | **FORBIDDEN** (`USING (false)`) | **FORBIDDEN** (`USING (false)`) | Scoped by `organization_id` |

---

## 4. Deep-Dive Policy Details

### 4.1 Internal Staff Notes Segregation (`complaint_comments`)
Internal municipal notes must never leak to citizens. This is guaranteed by the following policy:
```sql
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
```

### 4.2 Immutable Audit & History Guarantees
To prevent bad actors or compromised staff accounts from tampering with evidence or backdating resolution dates, `complaint_status_history` and `audit_logs` enforce absolute rejection of update/delete statements:
```sql
CREATE POLICY "status_history_no_update" ON complaint_status_history FOR UPDATE TO authenticated USING (false);
CREATE POLICY "status_history_no_delete" ON complaint_status_history FOR DELETE TO authenticated USING (false);
CREATE POLICY "audit_logs_no_update" ON audit_logs FOR UPDATE TO authenticated USING (false);
CREATE POLICY "audit_logs_no_delete" ON audit_logs FOR DELETE TO authenticated USING (false);
```

### 4.3 Safe Profile Creation Trigger
To prevent public signups from injecting elevated roles or bypassing profiles, the trigger `trg_on_auth_user_created` creates the base profile with safe defaults (`is_active = true`, `preferred_language = 'en'`). It cannot grant staff or admin permissions:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number, preferred_language)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
```

---

## 5. Backend Service Role Interaction Boundaries

The Node.js/Express backend handles sensitive workflows, file processing, and webhook events:

1. **User Context Requests (`anon` / `authenticated`):**
   * Mobile app and web portal requests pass the citizen's or staff member's Supabase JWT in the `Authorization: Bearer <token>` header.
   * When creating a Supabase client scoped to this user token, all PostgreSQL RLS policies apply automatically.
2. **Elevated Background Operations (`service_role`):**
   * Cron tasks (e.g. SLA breach monitoring), background push dispatching, and system audit logging use the `SUPABASE_SERVICE_ROLE_KEY`.
   * **Rule:** Service-role clients bypass RLS completely. Therefore, all backend controllers using the service client must perform explicit procedural authorization checks before executing database queries.
