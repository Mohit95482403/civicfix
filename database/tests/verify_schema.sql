-- ============================================================================
-- CivicFix Database Verification Script: verify_schema.sql
-- Phase: Day 4 Testing & Integrity Verification
-- Purpose: Verify presence of all tables, ENUM types, RLS enablement, and functions
-- ============================================================================

DO $$
DECLARE
  v_missing_tables TEXT[] := ARRAY[]::TEXT[];
  v_missing_enums TEXT[] := ARRAY[]::TEXT[];
  v_missing_functions TEXT[] := ARRAY[]::TEXT[];
  v_unsecured_tables TEXT[] := ARRAY[]::TEXT[];
  
  v_expected_tables TEXT[] := ARRAY[
    'organizations',
    'departments',
    'profiles',
    'staff_memberships',
    'platform_administrators',
    'complaint_categories',
    'complaints',
    'complaint_attachments',
    'complaint_assignments',
    'complaint_status_history',
    'complaint_comments',
    'resolution_evidence',
    'complaint_feedback',
    'notifications',
    'audit_logs'
  ];

  v_expected_enums TEXT[] := ARRAY[
    'complaint_status',
    'complaint_priority',
    'staff_role',
    'attachment_type',
    'comment_visibility',
    'notification_type'
  ];

  v_expected_functions TEXT[] := ARRAY[
    'is_org_member',
    'has_org_role',
    'is_platform_admin',
    'record_status_transition',
    'generate_complaint_reference',
    'handle_new_user'
  ];

  t TEXT;
  e TEXT;
  f TEXT;
  v_rls_enabled BOOLEAN;
BEGIN
  RAISE NOTICE '=======================================================';
  RAISE NOTICE 'Starting CivicFix Database Verification Test Suite...';
  RAISE NOTICE '=======================================================';

  -- 1. Check Expected Application Tables
  FOREACH t IN ARRAY v_expected_tables LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = t
    ) THEN
      v_missing_tables := array_append(v_missing_tables, t);
    END IF;
  END LOOP;

  -- 2. Check Expected Custom PostgreSQL ENUMs
  FOREACH e IN ARRAY v_expected_enums LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_type typ
      JOIN pg_namespace nsp ON nsp.oid = typ.typnamespace
      WHERE nsp.nspname = 'public' AND typ.typname = e
    ) THEN
      v_missing_enums := array_append(v_missing_enums, e);
    END IF;
  END LOOP;

  -- 3. Check Expected Helper Functions
  FOREACH f IN ARRAY v_expected_functions LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public' AND p.proname = f
    ) THEN
      v_missing_functions := array_append(v_missing_functions, f);
    END IF;
  END LOOP;

  -- 4. Check Row Level Security (RLS) Enablement on all tables
  FOREACH t IN ARRAY v_expected_tables LOOP
    SELECT c.relrowsecurity INTO v_rls_enabled
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = t;

    IF v_rls_enabled IS NOT TRUE THEN
      v_unsecured_tables := array_append(v_unsecured_tables, t);
    END IF;
  END LOOP;

  -- Output Results
  RAISE NOTICE '-------------------------------------------------------';
  RAISE NOTICE '1. Table Count Verified: % / %', array_length(v_expected_tables, 1) - COALESCE(array_length(v_missing_tables, 1), 0), array_length(v_expected_tables, 1);
  IF array_length(v_missing_tables, 1) > 0 THEN
    RAISE WARNING 'Missing Tables: %', v_missing_tables;
  ELSE
    RAISE NOTICE '   STATUS: PASS (All core application tables exist)';
  END IF;

  RAISE NOTICE '2. Custom ENUMs Verified: % / %', array_length(v_expected_enums, 1) - COALESCE(array_length(v_missing_enums, 1), 0), array_length(v_expected_enums, 1);
  IF array_length(v_missing_enums, 1) > 0 THEN
    RAISE WARNING 'Missing ENUMs: %', v_missing_enums;
  ELSE
    RAISE NOTICE '   STATUS: PASS (All domain ENUM types exist)';
  END IF;

  RAISE NOTICE '3. Functions Verified: % / %', array_length(v_expected_functions, 1) - COALESCE(array_length(v_missing_functions, 1), 0), array_length(v_expected_functions, 1);
  IF array_length(v_missing_functions, 1) > 0 THEN
    RAISE WARNING 'Missing Functions: %', v_missing_functions;
  ELSE
    RAISE NOTICE '   STATUS: PASS (All stored functions & triggers exist)';
  END IF;

  RAISE NOTICE '4. RLS Security Coverage:';
  IF array_length(v_unsecured_tables, 1) > 0 THEN
    RAISE WARNING 'Tables lacking RLS: %', v_unsecured_tables;
  ELSE
    RAISE NOTICE '   STATUS: PASS (100%% of tables have Row Level Security enabled)';
  END IF;

  RAISE NOTICE '=======================================================';
  RAISE NOTICE 'CivicFix Schema Integrity Verification Finished.';
  RAISE NOTICE '=======================================================';
END;
$$;
