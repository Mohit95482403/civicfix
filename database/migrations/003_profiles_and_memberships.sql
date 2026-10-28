-- ============================================================================
-- CivicFix Database Migration: 003_profiles_and_memberships.sql
-- Phase: Day 4 Database Architecture
-- Purpose: Create profiles, staff_memberships, and platform_administrators tables
-- ============================================================================

-- Ensure auth schema exists (standard in Supabase; mock stub for standalone Postgres)
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255),
  raw_user_meta_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- 1. Table: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  phone_number VARCHAR(25),
  avatar_path TEXT,
  preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT uq_profiles_email UNIQUE (email),
  CONSTRAINT chk_profiles_language CHECK (preferred_language IN ('en', 'kn', 'hi', 'mr', 'ta', 'te'))
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 2. Table: staff_memberships
-- Links users to specific organizations with assigned roles and optional departments
CREATE TABLE IF NOT EXISTS staff_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  role staff_role NOT NULL DEFAULT 'STAFF',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),

  CONSTRAINT uq_user_organization_membership UNIQUE (user_id, organization_id)
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_staff_memberships_user_id ON staff_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_memberships_org_role ON staff_memberships(organization_id, role);
CREATE INDEX IF NOT EXISTS idx_staff_memberships_dept_id ON staff_memberships(department_id);
CREATE INDEX IF NOT EXISTS idx_staff_memberships_is_active ON staff_memberships(is_active);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS trg_staff_memberships_updated_at ON staff_memberships;
CREATE TRIGGER trg_staff_memberships_updated_at
BEFORE UPDATE ON staff_memberships
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 3. Table: platform_administrators
-- Explicit separation of platform-wide superusers from organization-scoped admins
CREATE TABLE IF NOT EXISTS platform_administrators (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  notes TEXT
);

-- 4. Auth Signup Trigger: Automatically provisions a baseline profile
-- Executes with SECURITY DEFINER and fixed search_path to prevent search_path poisoning attacks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_full_name TEXT;
BEGIN
  -- Extract full name from raw_user_meta_data if present, or fallback to email prefix
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone_number,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    NEW.raw_user_meta_data->>'phone_number',
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = clock_timestamp();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error details gracefully without aborting the auth transaction
    RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
