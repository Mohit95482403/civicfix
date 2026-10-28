-- ============================================================================
-- CivicFix Seed Data: 001_seed_organizations_and_departments.sql
-- Phase: Day 4 Database Architecture
-- Purpose: Seed foundational organizations and departments with deterministic IDs
-- ============================================================================

-- 1. Fictional Pilot Organizations
INSERT INTO organizations (id, name, slug, code, description, contact_email, contact_phone, is_active)
VALUES 
  (
    '00000000-0000-4000-a000-000000000001',
    'Bengaluru Municipal Corporation (Pilot)',
    'blr-pilot',
    'BLR',
    'Pilot demonstration tenant for Bengaluru municipal wards (Koramangala, Indiranagar, Jayanagar).',
    'support@blr-civicfix.org',
    '+91-80-2222-1111',
    true
  ),
  (
    '00000000-0000-4000-a000-000000000002',
    'Pune Municipal Corporation (Pilot)',
    'pun-pilot',
    'PUN',
    'Pilot demonstration tenant for Pune municipal wards (Shivajinagar, Kothrud).',
    'support@pun-civicfix.org',
    '+91-20-2550-2222',
    true
  )
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  description = EXCLUDED.description,
  updated_at = clock_timestamp();

-- 2. Departments for Bengaluru Pilot Organization
INSERT INTO departments (id, organization_id, name, slug, code, description, is_active)
VALUES
  (
    '10000000-0000-4000-a000-000000000001',
    '00000000-0000-4000-a000-000000000001',
    'Roads & Infrastructure',
    'roads-infra',
    'ROADS',
    'Maintains public asphalt roads, flyovers, potholes, curbs, and road medians.',
    true
  ),
  (
    '10000000-0000-4000-a000-000000000002',
    '00000000-0000-4000-a000-000000000001',
    'Solid Waste Management',
    'solid-waste',
    'SAN',
    'Manages garbage collection bins, street sweeping, dump yards, and sanitation.',
    true
  ),
  (
    '10000000-0000-4000-a000-000000000003',
    '00000000-0000-4000-a000-000000000001',
    'Electrical & Street Lighting',
    'street-lighting',
    'ELEC',
    'Operates and repairs municipal street lamps, poles, feeder pillars, and cables.',
    true
  ),
  (
    '10000000-0000-4000-a000-000000000004',
    '00000000-0000-4000-a000-000000000001',
    'Water Supply & Sewerage',
    'water-sewerage',
    'WATER',
    'Maintains drinking water pipelines, storm water drains, and underground sewerage.',
    true
  ),
  (
    '10000000-0000-4000-a000-000000000005',
    '00000000-0000-4000-a000-000000000001',
    'Public Works Department',
    'pwd',
    'PWD',
    'Public buildings, parks, sidewalks, pedestrian bridges, and community halls.',
    true
  )
ON CONFLICT (organization_id, slug) DO UPDATE
SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  description = EXCLUDED.description,
  updated_at = clock_timestamp();
