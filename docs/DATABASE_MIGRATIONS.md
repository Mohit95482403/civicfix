# CivicFix Database Migration & Schema Evolution Guide

**Document Version:** 2.0.0  
**Phase:** Day 4 — Production-Minded Database Architecture, PostgreSQL Schema, Migrations, RLS & Seed Data  
**Status:** Approved & Implemented Baseline  

---

## 1. Migration Directory Architecture & Naming Conventions

All database schema evolutions, custom PostgreSQL types, functions, triggers, and Row Level Security policies are managed as version-controlled SQL files located in:
```
database/
├── migrations/
│   ├── 001_extensions_and_types.sql
│   ├── 002_organizations_and_departments.sql
│   ├── 003_profiles_and_memberships.sql
│   ├── 004_categories_and_complaints.sql
│   ├── 005_attachments_and_assignments.sql
│   ├── 006_comments_evidence_feedback.sql
│   ├── 007_notifications_and_audit.sql
│   ├── 008_helper_functions.sql
│   └── 009_row_level_security.sql
├── seeds/
│   ├── 001_seed_organizations_and_departments.sql
│   ├── 002_seed_categories.sql
│   └── 003_seed_demo_complaints.sql
└── README.md
```

### Naming Standard
* Format: `<sequence_number>_<concise_descriptive_name>.sql`
* Sequence numbering uses three zero-padded digits (`001`, `002`, `010`).
* Lowercase, snake_case words describing the primary functional domain.
* **Rule:** Once a migration has been merged to `main` and executed on staging or production, it is **immutable**. It must never be edited in place.

---

## 2. Implemented Migration Sequence & Dependencies

Migrations must execute in the exact order below due to strict foreign key relationships and type dependencies:

```
[001: Extensions & Domain ENUMs]
       │
       ▼
[002: Organizations & Departments]
       │
       ▼
[003: Profiles, Staff Memberships & Platform Admins]
       │
       ▼
[004: Complaint Categories, Reference Sequence & Complaints]
       │
       ▼
[005: Attachments, Assignments & Status History]
       │
       ▼
[006: Comments, Resolution Evidence & Citizen Feedback]
       │
       ▼
[007: Notifications & Audit Logs]
       │
       ▼
[008: Security Definer Helper Functions]
       │
       ▼
[009: Row Level Security Policies Across All 14 Tables]
```

### Breakdown of Migration Files

1. **`001_extensions_and_types.sql`:**
   - Enables `uuid-ossp` and optional `postgis`.
   - Provisions 6 custom ENUMs: `complaint_status`, `complaint_priority`, `staff_role`, `attachment_type`, `comment_visibility`, `notification_type`.
   - Creates the reusable `set_updated_at()` trigger function.

2. **`002_organizations_and_departments.sql`:**
   - Creates `organizations` (multi-tenant root) and `departments`.
   - Enforces unique slugs, municipal codes (`BLR`, `PUN`), and attaches `updated_at` triggers.

3. **`003_profiles_and_memberships.sql`:**
   - Creates `profiles` linked 1:1 with `auth.users(id)`.
   - Creates `staff_memberships` with unique `(user_id, organization_id)`.
   - Creates `platform_administrators` for global superusers.
   - Attaches `trg_on_auth_user_created` trigger on `auth.users` to automatically populate base profiles.

4. **`004_categories_and_complaints.sql`:**
   - Creates `complaint_categories` with SLA hour validations.
   - Sets up sequence-backed thread-safe reference generator `generate_complaint_reference()`.
   - Creates `complaints` table with coordinate bounds, coordinate pair constraints, and indexes.

5. **`005_attachments_and_assignments.sql`:**
   - Creates `complaint_attachments` (10MB size limit, image MIME check).
   - Creates `complaint_assignments` with partial unique index `uq_active_complaint_assignment` (`WHERE unassigned_at IS NULL`).
   - Creates immutable `complaint_status_history` table.

6. **`006_comments_evidence_feedback.sql`:**
   - Creates `complaint_comments` (visibility segregation).
   - Creates `resolution_evidence` (proof-of-work link).
   - Creates `complaint_feedback` (1–5 star rating constraint, unique per citizen per ticket).

7. **`007_notifications_and_audit.sql`:**
   - Creates in-app `notifications` queue.
   - Creates `audit_logs` (DPDP compliance, actor/org references).

8. **`008_helper_functions.sql`:**
   - Creates security-definer helper functions: `is_org_member()`, `has_org_role()`, `is_platform_admin()`.
   - Creates atomic stored procedure `record_status_transition()`.

9. **`009_row_level_security.sql`:**
   - Enables RLS on all 14 tables.
   - Defines explicit SELECT, INSERT, UPDATE, and DELETE policies.
   - Blocks updates and deletions on audit and history tables (`USING (false)`).

---

## 3. Remote Execution Workflow (Supabase Project Dashboard)

When connecting to an active Supabase project:

1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to your project → **SQL Editor**.
3. Create a new query tab for each migration.
4. Execute files in sequence:
   * Paste and run `001_extensions_and_types.sql` → Verify "Success".
   * Run `002_organizations_and_departments.sql` through `009_row_level_security.sql`.
5. Apply Seed Data:
   * Run `seeds/001_seed_organizations_and_departments.sql` (Inserts Bruhat Bengaluru Mahanagara Palike & Pune Municipal Corporation).
   * Run `seeds/002_seed_categories.sql` (Inserts 7 standard categories with SLA configurations).
   * (Optional for staging/demo): Run `seeds/003_seed_demo_complaints.sql`.

---

## 4. Supabase CLI Workflow

If the Supabase CLI is authenticated:

```powershell
# 1. Login to Supabase CLI
npx supabase login

# 2. Link your local repository to your remote Supabase project
npx supabase link --project-ref <your-supabase-project-id>

# 3. Check migration diff / status
npx supabase migration list

# 4. Push pending migrations to remote database
npx supabase db push
```

---

## 5. Guidelines for Future Migrations

1. **Incremental Only:** Never rewrite or alter existing applied migrations. Always create the next sequentially numbered file (e.g., `010_add_sla_escalation_rules.sql`).
2. **Backward Compatibility:** When adding columns, always supply a safe `DEFAULT` value or make the column nullable to avoid breaking running clients.
3. **Idempotence & Safety:**
   - Use `CREATE TABLE IF NOT EXISTS`.
   - Use `DROP POLICY IF EXISTS ... ON ...; CREATE POLICY ...`.
   - Use `CREATE INDEX IF NOT EXISTS`.
4. **Never Store Production Secrets:** No passwords, tokens, or encryption private keys in SQL files.

---

## 6. Failure Recovery & Rollback Strategy

1. **Transaction Wrapping:** When executing migrations manually or via script, wrap non-concurrent DDL in a transaction block:
   ```sql
   BEGIN;
   -- Migration DDL statements
   COMMIT;
   ```
   If any statement fails, PostgreSQL rolls back the entire block cleanly.
2. **Recovery from Partial Execution:**
   - Inspect the exact line error in the SQL Editor or CLI output.
   - If a table was created before failure, drop newly created uncommitted objects rather than running an untracked patch.
   - Correct the syntax or type issue, then re-execute the migration.
3. **Rollback Policy:** In production, rollbacks are performed via an explicit forward migration that reverses the previous change (e.g., `011_revert_feature_x.sql`), preserving the linear audit history.
