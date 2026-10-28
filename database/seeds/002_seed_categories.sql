-- ============================================================================
-- CivicFix Seed Data: 002_seed_categories.sql
-- Phase: Day 4 Database Architecture
-- Purpose: Seed standard complaint categories and SLA thresholds
-- ============================================================================

INSERT INTO complaint_categories (
  id,
  organization_id,
  department_id,
  name,
  slug,
  description,
  icon_key,
  sla_hours,
  priority,
  sort_order,
  is_active
)
VALUES
  (
    '20000000-0000-4000-a000-000000000001',
    '00000000-0000-4000-a000-000000000001',
    '10000000-0000-4000-a000-000000000001',
    'Roads & Potholes',
    'roads-potholes',
    'Potholes, broken asphalt, damaged speed bumps, and uneven road surfaces.',
    'pothole',
    48,
    'HIGH',
    1,
    true
  ),
  (
    '20000000-0000-4000-a000-000000000002',
    '00000000-0000-4000-a000-000000000001',
    '10000000-0000-4000-a000-000000000002',
    'Garbage & Sanitation',
    'garbage-sanitation',
    'Overflowing community garbage bins, uncleared roadside dump piles, and stench.',
    'trash-2',
    24,
    'URGENT',
    2,
    true
  ),
  (
    '20000000-0000-4000-a000-000000000003',
    '00000000-0000-4000-a000-000000000001',
    '10000000-0000-4000-a000-000000000003',
    'Streetlights',
    'streetlights',
    'Non-functioning streetlamps, dark alleys, flickering lights, and exposed wires.',
    'lightbulb',
    24,
    'HIGH',
    3,
    true
  ),
  (
    '20000000-0000-4000-a000-000000000004',
    '00000000-0000-4000-a000-000000000001',
    '10000000-0000-4000-a000-000000000004',
    'Water Supply & Leakage',
    'water-supply',
    'Burst drinking water mains, valve leaks, contaminated water, or low pressure.',
    'droplets',
    12,
    'URGENT',
    4,
    true
  ),
  (
    '20000000-0000-4000-a000-000000000005',
    '00000000-0000-4000-a000-000000000001',
    '10000000-0000-4000-a000-000000000004',
    'Drainage & Sewerage',
    'drainage-sewerage',
    'Clogged storm water drains, sewage backflow, open manholes, and waterlogging.',
    'waves',
    24,
    'URGENT',
    5,
    true
  ),
  (
    '20000000-0000-4000-a000-000000000006',
    '00000000-0000-4000-a000-000000000001',
    '10000000-0000-4000-a000-000000000005',
    'Public Infrastructure',
    'public-infrastructure',
    'Broken park benches, damaged pedestrian walkways, cracked footpaths, railings.',
    'building-2',
    72,
    'MEDIUM',
    6,
    true
  ),
  (
    '20000000-0000-4000-a000-000000000007',
    '00000000-0000-4000-a000-000000000001',
    NULL,
    'Other Civic Issues',
    'other-civic-issues',
    'Civic problems that do not clearly fall into defined municipal categories.',
    'help-circle',
    72,
    'LOW',
    7,
    true
  )
ON CONFLICT (organization_id, slug) DO UPDATE
SET
  department_id = EXCLUDED.department_id,
  name = EXCLUDED.name,
  sla_hours = EXCLUDED.sla_hours,
  priority = EXCLUDED.priority,
  icon_key = EXCLUDED.icon_key,
  updated_at = clock_timestamp();
