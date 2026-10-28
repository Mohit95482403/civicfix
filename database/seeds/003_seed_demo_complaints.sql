-- ============================================================================
-- CivicFix Seed Data: 003_seed_demo_complaints.sql
-- Phase: Day 4 Database Architecture
-- Purpose: Seed development test profiles, staff memberships, and sample complaints
-- NOTICE: For development and testing environments only. DO NOT EXECUTE IN PRODUCTION!
-- ============================================================================

-- 1. Development Test Users in auth.users and profiles
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
  ('30000000-0000-4000-a000-000000000001', 'citizen.priya@civicfix.test', '{"full_name": "Priya Sharma", "phone_number": "+91-98888-00001"}'::jsonb),
  ('30000000-0000-4000-a000-000000000002', 'staff.ramesh@civicfix.test', '{"full_name": "Ramesh Kumar", "phone_number": "+91-98888-00002"}'::jsonb),
  ('30000000-0000-4000-a000-000000000003', 'supervisor.sunita@civicfix.test', '{"full_name": "Sunita Patil", "phone_number": "+91-98888-00003"}'::jsonb),
  ('30000000-0000-4000-a000-000000000004', 'admin.anand@civicfix.test', '{"full_name": "Anand Verma", "phone_number": "+91-98888-00004"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, phone_number, is_active)
VALUES
  ('30000000-0000-4000-a000-000000000001', 'citizen.priya@civicfix.test', 'Priya Sharma', '+91-98888-00001', true),
  ('30000000-0000-4000-a000-000000000002', 'staff.ramesh@civicfix.test', 'Ramesh Kumar', '+91-98888-00002', true),
  ('30000000-0000-4000-a000-000000000003', 'supervisor.sunita@civicfix.test', 'Sunita Patil', '+91-98888-00003', true),
  ('30000000-0000-4000-a000-000000000004', 'admin.anand@civicfix.test', 'Anand Verma', '+91-98888-00004', true)
ON CONFLICT (id) DO UPDATE
SET
  full_name = EXCLUDED.full_name,
  phone_number = EXCLUDED.phone_number,
  updated_at = clock_timestamp();

-- 2. Staff Memberships for Bengaluru Pilot
INSERT INTO staff_memberships (user_id, organization_id, department_id, role, is_active)
VALUES
  -- Ramesh Kumar is a field technician in Roads & Infrastructure
  (
    '30000000-0000-4000-a000-000000000002',
    '00000000-0000-4000-a000-000000000001',
    '10000000-0000-4000-a000-000000000001',
    'STAFF',
    true
  ),
  -- Sunita Patil is a Supervisor in Roads & Infrastructure
  (
    '30000000-0000-4000-a000-000000000003',
    '00000000-0000-4000-a000-000000000001',
    '10000000-0000-4000-a000-000000000001',
    'SUPERVISOR',
    true
  ),
  -- Anand Verma is an Organization Administrator
  (
    '30000000-0000-4000-a000-000000000004',
    '00000000-0000-4000-a000-000000000001',
    NULL,
    'ORG_ADMIN',
    true
  )
ON CONFLICT (user_id, organization_id) DO UPDATE
SET
  department_id = EXCLUDED.department_id,
  role = EXCLUDED.role,
  updated_at = clock_timestamp();

-- 3. Development Sample Complaints
-- Complaint 1: In-Progress Pothole
INSERT INTO complaints (
  id,
  reference_number,
  organization_id,
  citizen_id,
  category_id,
  title,
  description,
  status,
  priority,
  latitude,
  longitude,
  address_text,
  location_description,
  submitted_at,
  sla_due_at
)
VALUES (
  '40000000-0000-4000-a000-000000000001',
  'CF-2026-BLR-001042',
  '00000000-0000-4000-a000-000000000001',
  '30000000-0000-4000-a000-000000000001',
  '20000000-0000-4000-a000-000000000001',
  'Severe pothole causing vehicle skidding on 100ft Ring Road',
  'Large 2-foot deep pothole near the bus stand junction. Water has collected inside creating dangerous conditions for two-wheelers.',
  'IN_PROGRESS',
  'HIGH',
  12.9716000,
  77.5946000,
  'Opposite Koramangala BDA Complex, 100ft Road, Bengaluru',
  'Near bus shelter #14',
  clock_timestamp() - interval '2 days',
  clock_timestamp() + interval '2 hours'
)
ON CONFLICT (reference_number) DO NOTHING;

-- Active Assignment for Complaint 1
INSERT INTO complaint_assignments (
  complaint_id,
  organization_id,
  department_id,
  assigned_to,
  assigned_by,
  assigned_at,
  notes
)
VALUES (
  '40000000-0000-4000-a000-000000000001',
  '00000000-0000-4000-a000-000000000001',
  '10000000-0000-4000-a000-000000000001',
  '30000000-0000-4000-a000-000000000002',
  '30000000-0000-4000-a000-000000000003',
  clock_timestamp() - interval '1 day',
  'Dispatched asphalt compaction unit for emergency road repair.'
)
ON CONFLICT DO NOTHING;

-- Status history for Complaint 1
INSERT INTO complaint_status_history (complaint_id, previous_status, new_status, changed_by, reason, created_at)
VALUES
  ('40000000-0000-4000-a000-000000000001', NULL, 'SUBMITTED', '30000000-0000-4000-a000-000000000001', 'Initial report submitted with photographs.', clock_timestamp() - interval '2 days'),
  ('40000000-0000-4000-a000-000000000001', 'SUBMITTED', 'VERIFIED', '30000000-0000-4000-a000-000000000003', 'Verified on CCTV as hazard to two-wheelers.', clock_timestamp() - interval '1 day 12 hours'),
  ('40000000-0000-4000-a000-000000000001', 'VERIFIED', 'ASSIGNED', '30000000-0000-4000-a000-000000000003', 'Assigned to field technician Ramesh Kumar.', clock_timestamp() - interval '1 day'),
  ('40000000-0000-4000-a000-000000000001', 'ASSIGNED', 'IN_PROGRESS', '30000000-0000-4000-a000-000000000002', 'Maintenance crew arrived on site with equipment.', clock_timestamp() - interval '4 hours')
ON CONFLICT DO NOTHING;

-- Comments for Complaint 1 (Both Citizen and Internal Notes)
INSERT INTO complaint_comments (complaint_id, author_id, body, visibility, created_at)
VALUES
  (
    '40000000-0000-4000-a000-000000000001',
    '30000000-0000-4000-a000-000000000001',
    'The water depth is increasing with the evening rain. Please expedite repair.',
    'CITIZEN_VISIBLE',
    clock_timestamp() - interval '1 day'
  ),
  (
    '40000000-0000-4000-a000-000000000002',
    '30000000-0000-4000-a000-000000000002',
    'Awaiting asphalt mix delivery from North Depot batch #14.',
    'INTERNAL_ONLY',
    clock_timestamp() - interval '8 hours'
  )
ON CONFLICT DO NOTHING;
