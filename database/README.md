# CivicFix Database Architecture, Migrations & Seeds

> **Phase:** Day 4 — Production-Minded Database Architecture, PostgreSQL Schema, Migrations, RLS & Seed Data  
> **Target Engine:** Supabase Managed PostgreSQL 15+ (with PostGIS spatial support)

This directory contains version-controlled DDL migrations, custom PostgreSQL ENUMs, triggers, Row Level Security (RLS) policies, and development seed datasets.

---

## 1. Directory Structure

```
database/
├── migrations/
│   ├── 001_extensions_and_types.sql          # uuid-ossp, postgis, 6 custom domain ENUMs, set_updated_at()
│   ├── 002_organizations_and_departments.sql # Multi-tenant organizations & departments tables + triggers
│   ├── 003_profiles_and_memberships.sql      # Profiles, staff_memberships, platform_admins, handle_new_user()
│   ├── 004_categories_and_complaints.sql     # Categories, generate_complaint_reference(), complaints table
│   ├── 005_attachments_and_assignments.sql   # Attachments, partial-unique active assignments, status history
│   ├── 006_comments_evidence_feedback.sql    # Segregated comments, resolution evidence, 1-5 star feedback
│   ├── 007_notifications_and_audit.sql       # In-app notifications & DPDP-compliant immutable audit logs
│   ├── 008_helper_functions.sql              # is_org_member, has_org_role, is_platform_admin, record_status_transition
│   └── 009_row_level_security.sql            # RLS enabled on all 14 tables with explicit role-scoped policies
├── seeds/
│   ├── 001_seed_organizations_and_departments.sql # Fictional pilot municipal councils & departments
│   ├── 002_seed_categories.sql                    # Standard 7 civic issue categories & SLA thresholds
│   └── 003_seed_demo_complaints.sql               # Development-only test users, assignments & demo complaints
└── README.md
```

---

## 2. Migration Execution Order

Migrations must be executed in strict numerical sequence:

| Step | Script | Core Entities Provisioned |
| :-: | :--- | :--- |
| **001** | `001_extensions_and_types.sql` | `uuid-ossp`, `complaint_status` (10 states), `complaint_priority`, `staff_role`, `attachment_type`, `comment_visibility`, `notification_type` |
| **002** | `002_organizations_and_departments.sql` | `organizations`, `departments` |
| **003** | `003_profiles_and_memberships.sql` | `profiles`, `staff_memberships`, `platform_administrators`, `handle_new_user()` trigger |
| **004** | `004_categories_and_complaints.sql` | `complaint_categories`, `complaint_reference_seq`, `generate_complaint_reference()`, `complaints` |
| **005** | `005_attachments_and_assignments.sql` | `complaint_attachments`, `complaint_assignments` (1 active per ticket), `complaint_status_history` |
| **006** | `006_comments_evidence_feedback.sql` | `complaint_comments` (internal vs citizen visible), `resolution_evidence`, `complaint_feedback` |
| **007** | `007_notifications_and_audit.sql` | `notifications`, `audit_logs` (immutable governance trail) |
| **008** | `008_helper_functions.sql` | Security definer functions: `is_org_member`, `has_org_role`, `record_status_transition` |
| **009** | `009_row_level_security.sql` | RLS enablement & explicit access control policies across all 14 tables |

---

## 3. How to Apply Migrations

### Option A: Using Supabase Dashboard (Recommended for Remote Project)
1. Open your Supabase Project Dashboard → **SQL Editor**.
2. Open and run each migration in numerical sequence (`001` through `009`).
3. To load development sample data, run `seeds/001_seed_organizations_and_departments.sql` and `seeds/002_seed_categories.sql`.
4. Run `seeds/003_seed_demo_complaints.sql` only on local or development test environments.

### Option B: Using Supabase CLI (Linked Project)
```bash
# Link project
npx supabase link --project-ref your-project-id

# Push migrations to remote database
npx supabase db push
```

---

## 4. Key Security & Architecture Guarantees

1. **Strict Multi-Tenancy:** All department records, categories, complaints, staff memberships, and audit trails are scoped to `organization_id`.
2. **Immutable Audit Trails:** `complaint_status_history` and `audit_logs` enforce RLS policies that reject all `UPDATE` and `DELETE` queries (`USING (false)`).
3. **Internal Note Segregation:** Internal staff notes (`visibility = 'INTERNAL_ONLY'`) are shielded from citizen queries at both the RLS and API layer.
4. **Single Active Assignee:** Enforced by partial unique index `uq_active_complaint_assignment` on `(complaint_id) WHERE unassigned_at IS NULL`.
5. **No Blind Service Role in Clients:** Client apps connect using Supabase Auth anon tokens; backend mediates elevated transactions.
