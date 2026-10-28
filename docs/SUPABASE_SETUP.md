# CivicFix Supabase Architecture & Setup Guide
**Document Version:** 1.0.0  
**Phase:** Day 3: Development Environment Setup and Project Foundation  
**Status:** Approved Baseline  

---

## 1. Overview & Architectural Role

Supabase serves as the managed backend infrastructure layer for CivicFix, providing:
1. **Managed PostgreSQL 15+** with the `postgis` spatial extension for geospatial coordinates.
2. **Supabase Auth** for citizen, staff, supervisor, and administrator JWT authentication.
3. **Supabase Storage** for secure storage of citizen hazard photos and mandatory repair proof evidence.
4. **PostgreSQL Row Level Security (RLS)** as defense-in-depth authorization.

> **Implementation Roadmap:** The database schema migrations and Supabase tables are scheduled for **Day 4**. Authentication integration is scheduled for **Day 6**.

---

## 2. Step-by-Step Supabase Project Creation

When setting up your Supabase project (scheduled for Day 4):

1. **Create Account / Project:**
   * Sign in to [supabase.com](https://supabase.com).
   * Click **New Project** in your organization dashboard.
   * **Project Name:** `civicfix-production` (or `civicfix-dev`).
   * **Database Password:** Generate a secure, 24+ character password and store it safely in your password manager.
   * **Region:** Select the region closest to your target municipal deployment (e.g., `ap-south-1` Mumbai for India).
   * **Pricing Plan:** Free tier is fully sufficient for development and prototype phases.

2. **Locate Credentials in Supabase Dashboard:**
   * Navigate to **Project Settings** → **API**.
   * **Project URL:** Found under `Project URL` (e.g. `https://your-project-id.supabase.co`).
   * **Anon Public Key:** Found under `Project API keys` → `anon / public`. This is safe for client applications (`staff-portal`, `admin-portal`, `mobile`).
   * **Service Role Secret Key:** Found under `Project API keys` → `service_role / secret`.
     * ⚠️ **CRITICAL SECURITY REQUIREMENT:** This key bypasses all Row Level Security.
     * Place this key **ONLY** in `backend/.env` under `SUPABASE_SECRET_KEY`.
     * **NEVER** expose this key in client web applications, Flutter code, or Git commits.

---

## 3. Storage Bucket Configuration (Day 4 Scope)

CivicFix requires two private S3-compatible cloud storage buckets:

| Bucket Name | Access Level | Permitted File Types | Max File Size | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `complaint-photos` | Authenticated Read / Write via API | JPEG, PNG, WebP | 10 MB | Citizen initial hazard evidence photos |
| `resolution-evidence` | Staff / Admin Read / Write via API | JPEG, PNG, WebP | 10 MB | Technician repair proof photos |

Buckets are configured as **private**. Files are uploaded and retrieved using signed time-limited URLs generated exclusively by the Node.js backend.

---

## 4. Row Level Security (RLS) Strategy

PostgreSQL Row Level Security ensures data isolation even if an application bug occurs:
* `profiles`: Users can view public profiles; only the profile owner can update their own personal info.
* `complaints`: Public citizens can read verified and non-sensitive complaints in their city; only creator or assigned staff can modify status.
* `complaint_assignments`: Field staff can only read work orders assigned to their department or user ID.
* `audit_logs`: Append-only table. No user (including administrators) can update or delete audit records.

---

## 5. Migration Execution Strategy

Migrations are managed as versioned SQL scripts in `database/migrations/`:
* `001_extensions_and_types.sql`: Enables `uuid-ossp` and `postgis`, creates custom ENUMs.
* `002_organizations_and_departments.sql`: Scoping tables.
* `003_profiles_and_roles.sql`: User tables linked to `auth.users`.
* `004_categories_and_complaints.sql`: Incident management tables.
* `005_rls_policies.sql`: Complete PostgreSQL Row Level Security rules.

Execution of these scripts will be performed on **Day 4**.
