-- ============================================================================
-- CivicFix Database Migration: 005_attachments_and_assignments.sql
-- Phase: Day 4 Database Architecture
-- Purpose: Create complaint_attachments, complaint_assignments, and complaint_status_history
-- ============================================================================

-- 1. Table: complaint_attachments
-- Stores storage pointers for photos in private Supabase Storage buckets
CREATE TABLE IF NOT EXISTS complaint_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  storage_path TEXT NOT NULL,
  original_filename VARCHAR(255),
  mime_type VARCHAR(100) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  attachment_type attachment_type NOT NULL DEFAULT 'COMPLAINT_PHOTO',
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT chk_attachment_file_size CHECK (file_size_bytes > 0 AND file_size_bytes <= 10485760), -- Max 10MB
  CONSTRAINT chk_attachment_mime_type CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'image/heic'))
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_attachments_complaint_id ON complaint_attachments(complaint_id);
CREATE INDEX IF NOT EXISTS idx_attachments_uploaded_by ON complaint_attachments(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_attachments_type ON complaint_attachments(attachment_type);

-- 2. Table: complaint_assignments
-- Preserves complete delegation history while strictly guaranteeing a single active assignee
CREATE TABLE IF NOT EXISTS complaint_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE RESTRICT,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  assigned_to UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  assigned_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  unassigned_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT chk_assignment_unassigned_after_assigned CHECK (
    unassigned_at IS NULL OR unassigned_at >= assigned_at
  )
);

-- Partial Unique Index: Exactly one active technician/crew assignment per complaint
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_complaint_assignment
ON complaint_assignments (complaint_id)
WHERE unassigned_at IS NULL;

-- Indexing for queries
CREATE INDEX IF NOT EXISTS idx_assignments_assigned_to_active 
ON complaint_assignments(assigned_to) 
WHERE unassigned_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_assignments_complaint_id ON complaint_assignments(complaint_id);
CREATE INDEX IF NOT EXISTS idx_assignments_department_id ON complaint_assignments(department_id);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS trg_complaint_assignments_updated_at ON complaint_assignments;
CREATE TRIGGER trg_complaint_assignments_updated_at
BEFORE UPDATE ON complaint_assignments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 3. Table: complaint_status_history
-- Immutable append-only record of every workflow state transition
CREATE TABLE IF NOT EXISTS complaint_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE RESTRICT,
  previous_status complaint_status,
  new_status complaint_status NOT NULL,
  changed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- Indexing for timeline display
CREATE INDEX IF NOT EXISTS idx_status_history_complaint_date 
ON complaint_status_history(complaint_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_status_history_changed_by ON complaint_status_history(changed_by);
