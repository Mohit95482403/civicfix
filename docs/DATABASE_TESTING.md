# CivicFix Database Testing & Verification Specification

**Document Version:** 2.0.0  
**Phase:** Day 4 — Production-Minded Database Architecture, PostgreSQL Schema, Migrations, RLS & Seed Data  
**Status:** Verification Plan & Test Suite Baseline  

---

## 1. Verification Strategy & Execution Status

To ensure uncompromising database reliability without overstating test execution, this document distinguishes between:
1. **Static Schema & Constraint Verification (COMPLETED):** All 9 SQL migration files and 3 seed scripts were parsed, analyzed for relational integrity, foreign key consistency, constraint syntax, and policy completeness.
2. **Local Environment Diagnostic (COMPLETED):** Host environment was inspected: Windows 10/11, Node.js v24.18.0, npm 11.16.0. Native `docker` daemon and local standalone `psql` binary are not present on this host machine.
3. **Executable Verification Suite (PREPARED):** An executable test script ([database/tests/verify_schema.sql](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/database/tests/verify_schema.sql)) is provided for automated execution in the Supabase SQL Editor or Supabase CLI CI/CD runner.
4. **Live Integration Tests (PENDING SUPABASE PROJECT LINK):** Requires active Supabase project credentials (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) to run live network queries.

---

## 2. Integrity Test Cases & Expectations

The following test matrix validates that relational rules and domain constraints fail or succeed as specified:

| Test ID | Entity | Test Description | Input / Condition | Expected Result | Static Audit |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **TC-INT-01** | `organizations` | Invalid municipal code | Code = `'blr'` (lowercase) or `'B'` (too short) | Fails `chk_organizations_code_format` regex | **PASS** |
| **TC-INT-02** | `organizations` | Duplicate slug | Inserting two orgs with slug `'bbmp'` | Fails unique constraint `uq_organizations_slug` | **PASS** |
| **TC-INT-03** | `departments` | Duplicate department code in same org | Two depts in same org with code `'ROADS'` | Fails `UNIQUE (organization_id, code)` | **PASS** |
| **TC-INT-04** | `departments` | Same department code in different orgs | Dept `'ROADS'` in BBMP and `'ROADS'` in PMC | Succeeds (scoped uniqueness) | **PASS** |
| **TC-INT-05** | `profiles` | Invalid preferred language | Language = `'fr'` | Fails `chk_profiles_language` | **PASS** |
| **TC-INT-06** | `complaints` | Coordinate pair violation | `latitude = 12.9716`, `longitude = NULL` | Fails `chk_complaints_coords_pair` | **PASS** |
| **TC-INT-07** | `complaints` | Coordinate bounds violation | `latitude = 120.0` (exceeds 90) | Fails `chk_complaints_coords_range` | **PASS** |
| **TC-INT-08** | `complaints` | Short title / description | Title = `'Pot'` (< 5 chars) | Fails `chk_complaints_title_length` | **PASS** |
| **TC-INT-09** | `complaint_attachments`| File size limit breach | `file_size_bytes = 15000000` (> 10MB) | Fails `chk_attachment_file_size` | **PASS** |
| **TC-INT-10** | `complaint_attachments`| Disallowed MIME type | `mime_type = 'application/pdf'` | Fails `chk_attachment_mime_type` | **PASS** |
| **TC-INT-11** | `complaint_assignments`| Multiple active assignees | Inserting 2nd active assignment with `unassigned_at IS NULL` | Fails partial unique index `uq_active_complaint_assignment` | **PASS** |
| **TC-INT-12** | `complaint_assignments`| Reassignment history | Setting `unassigned_at = now()` on existing assignment and inserting new active one | Succeeds (preserves delegation trail) | **PASS** |
| **TC-INT-13** | `complaint_feedback` | Rating out of range | `rating = 0` or `rating = 6` | Fails `chk_feedback_rating_range` | **PASS** |
| **TC-INT-14** | `complaint_feedback` | Duplicate citizen feedback | Citizen submits 2nd feedback for same ticket | Fails `uq_complaint_citizen_feedback` | **PASS** |

---

## 3. Authorization & RLS Test Cases

The following matrix defines the security policies verified across all actor roles:

| Test ID | Role / Actor | Target Resource | Operation | Policy Rule Tested | Expected Result |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **TC-SEC-01** | Citizen A | Citizen B's complaint (`SUBMITTED`) | `SELECT` | `complaints_select_policy` | Record excluded from result set (0 rows) |
| **TC-SEC-02** | Citizen A | Own complaint | `UPDATE` | `complaints_update_policy` | Allowed only while `status = 'SUBMITTED'` |
| **TC-SEC-03** | Citizen A | Own complaint (`IN_PROGRESS`) | `UPDATE` | `complaints_update_policy` | Rejected; citizen cannot mutate active work |
| **TC-SEC-04** | Citizen A | Complaint assignments | `INSERT` | `assignments_modify_supervisors` | Rejected; citizens cannot assign tickets |
| **TC-SEC-05** | Citizen A | Internal municipal note | `SELECT` | `comments_select_policy` | Filtered out; citizen sees only `CITIZEN_VISIBLE` |
| **TC-SEC-06** | Citizen A | Internal note creation | `INSERT` | `comments_insert_policy` | Rejected; citizen restricted to `CITIZEN_VISIBLE` |
| **TC-SEC-07** | Staff (Org A) | Complaints in Org B | `SELECT` | `complaints_select_policy` | Filtered out; cross-org leakage prevented |
| **TC-SEC-08** | Staff (Org A) | Assignments in Org A | `SELECT` | `assignments_select_policy` | Visible to staff in same organization |
| **TC-SEC-09** | Any Actor | `complaint_status_history` | `UPDATE` | `status_history_no_update` | Rejected with error (`USING (false)`) |
| **TC-SEC-10** | Any Actor | `complaint_status_history` | `DELETE` | `status_history_no_delete` | Rejected with error (`USING (false)`) |
| **TC-SEC-11** | Any Actor | `audit_logs` | `UPDATE` / `DELETE` | `audit_logs_no_update` | Rejected with error (`USING (false)`) |
| **TC-SEC-12** | Citizen | Resolution Evidence | `SELECT` | `evidence_select_policy` | Visible only once complaint is `RESOLVED` or `CLOSED` |

---

## 4. How to Run the Executable Verification Script

When a Supabase database instance is available:

### In Supabase SQL Editor:
1. Open [database/tests/verify_schema.sql](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/database/tests/verify_schema.sql).
2. Copy all contents and execute in the SQL Editor.
3. Review the test results table output. All assertions should return `STATUS: PASS`.

### In CI / Automated Terminal:
```bash
# Using Supabase CLI to test local or remote database
npx supabase test db
```

---

## 5. Summary of Audit Findings

* **Relational Schema:** All 14 core tables adhere to 3NF standards with explicit foreign keys.
* **RLS Coverage:** 100% of tables have Row Level Security enabled with explicit policies.
* **Auditability:** Zero tables permit untracked status mutation. Status history and audit logs are physically protected against tampering.
* **Multi-Tenant Safety:** All organizational data queries require verified organization membership or superuser permissions.
