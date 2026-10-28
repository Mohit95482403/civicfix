-- ============================================================================
-- CivicFix Database Migration: 008_helper_functions.sql
-- Phase: Day 4 Database Architecture
-- Purpose: Security-definer helper functions for RLS and atomic status transitions
-- ============================================================================

-- 1. Helper: Check if user is a member of an organization
CREATE OR REPLACE FUNCTION public.is_org_member(p_org_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, auth, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_memberships
    WHERE organization_id = p_org_id
      AND user_id = p_user_id
      AND is_active = true
  );
$$;

-- 2. Helper: Check if user has a specific organization role or higher
CREATE OR REPLACE FUNCTION public.has_org_role(p_org_id UUID, p_user_id UUID, p_required_role staff_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_role staff_role;
BEGIN
  SELECT role INTO v_role
  FROM staff_memberships
  WHERE organization_id = p_org_id
    AND user_id = p_user_id
    AND is_active = true;

  IF v_role IS NULL THEN
    RETURN false;
  END IF;

  -- Role hierarchy check:
  -- ORG_ADMIN > SUPERVISOR > STAFF
  IF p_required_role = 'STAFF' THEN
    RETURN true;
  ELSIF p_required_role = 'SUPERVISOR' THEN
    RETURN v_role IN ('SUPERVISOR', 'ORG_ADMIN');
  ELSIF p_required_role = 'ORG_ADMIN' THEN
    RETURN v_role = 'ORG_ADMIN';
  END IF;

  RETURN false;
END;
$$;

-- 3. Helper: Check if user is a platform-wide administrator
CREATE OR REPLACE FUNCTION public.is_platform_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, auth, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM platform_administrators
    WHERE user_id = p_user_id
  );
$$;

-- 4. Atomic Status Transition Procedure
-- Ensures complaint table status and status_history audit log are written together atomically
CREATE OR REPLACE FUNCTION public.record_status_transition(
  p_complaint_id UUID,
  p_new_status complaint_status,
  p_actor_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_prev_status complaint_status;
  v_org_id UUID;
  v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
  -- 1. Fetch current status and organization
  SELECT status, organization_id INTO v_prev_status, v_org_id
  FROM complaints
  WHERE id = p_complaint_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Complaint % not found', p_complaint_id;
  END IF;

  -- 2. Update complaint record with appropriate lifecycle timestamps
  UPDATE complaints
  SET
    status = p_new_status,
    resolved_at = CASE WHEN p_new_status = 'RESOLVED' THEN v_now ELSE resolved_at END,
    closed_at   = CASE WHEN p_new_status = 'CLOSED'   THEN v_now ELSE closed_at END,
    reopened_at = CASE WHEN p_new_status = 'REOPENED' THEN v_now ELSE reopened_at END,
    updated_at  = v_now
  WHERE id = p_complaint_id;

  -- 3. Insert immutable status history entry
  INSERT INTO complaint_status_history (
    complaint_id,
    previous_status,
    new_status,
    changed_by,
    reason,
    created_at
  )
  VALUES (
    p_complaint_id,
    v_prev_status,
    p_new_status,
    p_actor_id,
    p_reason,
    v_now
  );

  -- 4. Write to system-wide audit logs
  INSERT INTO audit_logs (
    actor_id,
    organization_id,
    action,
    entity_type,
    entity_id,
    metadata,
    created_at
  )
  VALUES (
    p_actor_id,
    v_org_id,
    'COMPLAINT_STATUS_TRANSITION',
    'complaint',
    p_complaint_id::text,
    jsonb_build_object(
      'previous_status', v_prev_status,
      'new_status', p_new_status,
      'reason', p_reason
    ),
    v_now
  );
END;
$$;
