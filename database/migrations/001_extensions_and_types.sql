-- ============================================================================
-- CivicFix Database Migration: 001_extensions_and_types.sql
-- Phase: Day 4 Database Architecture
-- Purpose: Enable core PostgreSQL extensions, custom ENUM types, and shared triggers
-- ============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PostGIS is conditionally created if available on the host environment
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_available_extensions WHERE name = 'postgis') THEN
    CREATE EXTENSION IF NOT EXISTS "postgis";
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'PostGIS extension not available in this environment. Falling back to numeric coordinates.';
END $$;

-- 2. Domain ENUMs
-- 2.1 Complaint Lifecycle Status (10 Required States)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complaint_status') THEN
    CREATE TYPE complaint_status AS ENUM (
      'SUBMITTED',
      'UNDER_REVIEW',
      'VERIFIED',
      'ASSIGNED',
      'IN_PROGRESS',
      'RESOLVED',
      'CLOSED',
      'REOPENED',
      'REJECTED',
      'DUPLICATE'
    );
  END IF;
END $$;

-- 2.2 Priority Levels
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complaint_priority') THEN
    CREATE TYPE complaint_priority AS ENUM (
      'LOW',
      'MEDIUM',
      'HIGH',
      'URGENT'
    );
  END IF;
END $$;

-- 2.3 Staff & Administrative Roles within an Organization
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'staff_role') THEN
    CREATE TYPE staff_role AS ENUM (
      'STAFF',
      'SUPERVISOR',
      'ORG_ADMIN'
    );
  END IF;
END $$;

-- 2.4 Attachment Media Types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attachment_type') THEN
    CREATE TYPE attachment_type AS ENUM (
      'COMPLAINT_PHOTO',
      'RESOLUTION_PROOF',
      'OTHER'
    );
  END IF;
END $$;

-- 2.5 Comment Visibility (Strict Segregation of Internal vs Citizen Notes)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comment_visibility') THEN
    CREATE TYPE comment_visibility AS ENUM (
      'CITIZEN_VISIBLE',
      'INTERNAL_ONLY'
    );
  END IF;
END $$;

-- 2.6 Notification Delivery Types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM (
      'STATUS_UPDATE',
      'ASSIGNMENT',
      'COMMENT',
      'SLA_WARNING',
      'SYSTEM'
    );
  END IF;
END $$;

-- 3. Shared Trigger Functions
-- Automatically updates updated_at column to current timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = clock_timestamp();
  RETURN NEW;
END;
$$;
