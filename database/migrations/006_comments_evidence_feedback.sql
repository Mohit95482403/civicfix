-- ============================================================================
-- CivicFix Database Migration: 006_comments_evidence_feedback.sql
-- Phase: Day 4 Database Architecture
-- Purpose: Create complaint_comments, resolution_evidence, and complaint_feedback tables
-- ============================================================================

-- 1. Table: complaint_comments
-- Supports citizen-visible conversation thread and internal departmental notes
CREATE TABLE IF NOT EXISTS complaint_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  body TEXT NOT NULL,
  visibility comment_visibility NOT NULL DEFAULT 'CITIZEN_VISIBLE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT chk_comments_body_not_empty CHECK (char_length(trim(body)) >= 1)
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_comments_complaint_date ON complaint_comments(complaint_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_comments_author ON complaint_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_visibility ON complaint_comments(visibility);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS trg_complaint_comments_updated_at ON complaint_comments;
CREATE TRIGGER trg_complaint_comments_updated_at
BEFORE UPDATE ON complaint_comments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 2. Table: resolution_evidence
-- Mandatory proof-of-work submitted by technician before a ticket is marked RESOLVED
CREATE TABLE IF NOT EXISTS resolution_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE RESTRICT,
  submitted_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  attachment_id UUID REFERENCES complaint_attachments(id) ON DELETE SET NULL,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT chk_resolution_desc_length CHECK (char_length(trim(description)) >= 5)
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_resolution_evidence_complaint ON resolution_evidence(complaint_id);
CREATE INDEX IF NOT EXISTS idx_resolution_evidence_submitted_by ON resolution_evidence(submitted_by);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS trg_resolution_evidence_updated_at ON resolution_evidence;
CREATE TRIGGER trg_resolution_evidence_updated_at
BEFORE UPDATE ON resolution_evidence
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 3. Table: complaint_feedback
-- Citizen 1-5 star satisfaction rating and remarks captured upon resolution
CREATE TABLE IF NOT EXISTS complaint_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE RESTRICT,
  citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT chk_feedback_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT uq_complaint_citizen_feedback UNIQUE (complaint_id, citizen_id)
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_feedback_complaint_id ON complaint_feedback(complaint_id);
CREATE INDEX IF NOT EXISTS idx_feedback_citizen_id ON complaint_feedback(citizen_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON complaint_feedback(rating);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS trg_complaint_feedback_updated_at ON complaint_feedback;
CREATE TRIGGER trg_complaint_feedback_updated_at
BEFORE UPDATE ON complaint_feedback
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
