# CivicFix Database Architecture & Migrations

> **Phase:** Day 3 — Environment Setup (Schema Migration Execution Scheduled for Day 4)  
> **Target Engine:** Supabase Managed PostgreSQL 15+ with PostGIS Extension

This directory contains the version-controlled database schema migrations, seed scripts, and Row Level Security (RLS) policies for the CivicFix platform.

---

## 1. Directory Structure

```
database/
├── migrations/         # Incremental DDL migration scripts (001_initial_schema.sql, etc.)
├── seeds/              # Seed datasets (categories, organizations, test users)
└── README.md
```

---

## 2. Planned 14-Table Relational Schema (Day 4 Scope)

As engineered in [`docs/DATABASE_PLAN.md`](../docs/DATABASE_PLAN.md), the database schema models:

1. `organizations`: Municipal councils (e.g., BBMP Bengaluru).
2. `departments`: Functional divisions (Roads, Solid Waste, Street Lighting, Water & Sewerage, PWD).
3. `profiles`: User identity linked 1:1 with `auth.users` via Supabase UUID foreign key.
4. `roles`: Standard user roles (`CITIZEN`, `STAFF`, `SUPERVISOR`, `DEPT_ADMIN`, `SUPER_ADMIN`).
5. `user_roles`: Role assignments with department scoping.
6. `categories`: Complaint types with default SLA duration (hours), priority, and department mapping.
7. `complaints`: Core work orders with GPS coordinates (`GEOGRAPHY(Point, 4326)`), status, and reference code.
8. `complaint_photos`: Initial citizen evidence photos stored in Supabase Storage.
9. `complaint_status_history`: Immutable lifecycle audit state transitions.
10. `complaint_assignments`: Work order delegation to field technicians.
11. `resolution_evidence`: Mandatory proof-of-work photos, repair notes, and field GPS verification.
12. `complaint_comments`: Public citizen-staff conversation threads and internal notes.
13. `complaint_feedback`: Citizen 1–5 star ratings and resolution confirmation.
14. `audit_logs`: Governance-level audit trail adhering to DPDP compliance.

---

## 3. Migration Execution Notice

Execution of the DDL migration scripts and Supabase database initialization is scheduled for **Day 4: Supabase Project & PostgreSQL Schema**.
