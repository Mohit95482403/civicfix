-- ============================================================================
-- CivicFix Database Migration: 004_categories_and_complaints.sql
-- Phase: Day 4 Database Architecture
-- Purpose: Create complaint_categories, complaint reference generator, and complaints table
-- ============================================================================

-- 1. Table: complaint_categories
CREATE TABLE IF NOT EXISTS complaint_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(60) NOT NULL,
  description TEXT,
  icon_key VARCHAR(50) NOT NULL DEFAULT 'alert-circle',
  sla_hours INTEGER NOT NULL DEFAULT 48,
  priority complaint_priority NOT NULL DEFAULT 'HIGH',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT chk_categories_sla_positive CHECK (sla_hours > 0),
  CONSTRAINT uq_categories_org_slug UNIQUE NULLS NOT DISTINCT (organization_id, slug)
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_complaint_categories_org ON complaint_categories(organization_id);
CREATE INDEX IF NOT EXISTS idx_complaint_categories_dept ON complaint_categories(department_id);
CREATE INDEX IF NOT EXISTS idx_complaint_categories_active ON complaint_categories(is_active);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS trg_complaint_categories_updated_at ON complaint_categories;
CREATE TRIGGER trg_complaint_categories_updated_at
BEFORE UPDATE ON complaint_categories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 2. Sequence & Thread-safe Complaint Reference Generator
CREATE SEQUENCE IF NOT EXISTS complaint_reference_seq START WITH 1001;

CREATE OR REPLACE FUNCTION generate_complaint_reference(p_org_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_org_code TEXT;
  v_year TEXT;
  v_seq_val BIGINT;
BEGIN
  -- Retrieve organization code (e.g. BLR, PUN), fallback to 'GEN'
  SELECT COALESCE(code, 'GEN') INTO v_org_code
  FROM organizations
  WHERE id = p_org_id;

  IF v_org_code IS NULL THEN
    v_org_code := 'GEN';
  END IF;

  v_year := to_char(clock_timestamp(), 'YYYY');
  v_seq_val := nextval('complaint_reference_seq');

  -- Format: CF-YYYY-ORG-NNNNNN
  RETURN 'CF-' || v_year || '-' || v_org_code || '-' || lpad(v_seq_val::text, 6, '0');
END;
$$;

-- 3. Table: complaints
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number VARCHAR(35) NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  category_id UUID NOT NULL REFERENCES complaint_categories(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status complaint_status NOT NULL DEFAULT 'SUBMITTED',
  priority complaint_priority NOT NULL DEFAULT 'HIGH',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  address_text TEXT,
  location_description TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  sla_due_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  reopened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT uq_complaints_reference_number UNIQUE (reference_number),
  CONSTRAINT chk_complaints_title_length CHECK (char_length(trim(title)) >= 5),
  CONSTRAINT chk_complaints_description_length CHECK (char_length(trim(description)) >= 10),
  CONSTRAINT chk_complaints_coords_range CHECK (
    (latitude BETWEEN -90.0 AND 90.0) AND (longitude BETWEEN -180.0 AND 180.0)
  ),
  CONSTRAINT chk_complaints_coords_pair CHECK (
    (latitude IS NULL AND longitude IS NULL) OR (latitude IS NOT NULL AND longitude IS NOT NULL)
  )
);

-- Indexing for real query patterns
CREATE INDEX IF NOT EXISTS idx_complaints_org_status ON complaints(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_complaints_citizen_created ON complaints(citizen_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_category_status ON complaints(category_id, status);
CREATE INDEX IF NOT EXISTS idx_complaints_reference_number ON complaints(reference_number);
CREATE INDEX IF NOT EXISTS idx_complaints_submitted_at ON complaints(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_sla_active ON complaints(sla_due_at)
WHERE status NOT IN ('RESOLVED', 'CLOSED', 'REJECTED');

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS trg_complaints_updated_at ON complaints;
CREATE TRIGGER trg_complaints_updated_at
BEFORE UPDATE ON complaints
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
