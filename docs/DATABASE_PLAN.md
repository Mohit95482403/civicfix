# Database Architecture & Data Model Plan
## Project: CivicFix — Civic Problem Reporting & Resolution Tracking Platform
**Document Version:** 2.0.0  
**Phase:** Day 4: Production-Minded Database Architecture, PostgreSQL Schema, Migrations, RLS & Seed Data  
**Status:** Implemented Baseline & Production Architecture  
**Execution Note:** *The database architecture was fully implemented on Day 4 across 9 ordered migrations in `database/migrations/`. Detailed technical specs are maintained in [docs/DATABASE_SCHEMA.md](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/docs/DATABASE_SCHEMA.md), [docs/DATABASE_RELATIONSHIPS.md](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/docs/DATABASE_RELATIONSHIPS.md), [docs/RLS_POLICIES.md](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/docs/RLS_POLICIES.md), and [docs/DATABASE_MIGRATIONS.md](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/docs/DATABASE_MIGRATIONS.md).*

---

## 1. Database Engine & Architectural Principles

CivicFix utilizes **Supabase PostgreSQL 15+** as its primary relational database engine. The data model enforces strong referential integrity, multi-tenant organization scoping, append-only audit histories, and geospatial capabilities.

### 1.1 Core Principles
1. **Strong Referential Integrity:** Foreign keys are explicitly defined with appropriate `ON DELETE` rules (`RESTRICT` or `CASCADE`) to prevent orphaned records.
2. **Organization-Level Scoping:** All organizational entities (departments, staff, categories, complaints, assignments, and audit logs) are indexed and scoped by `organization_id` to enforce strict multi-tenancy.
3. **Immutable History & Auditing:** Critical workflow changes (status transitions, staff assignments, administrative overrides) are recorded in append-only log tables (`complaint_status_history`, `complaint_assignments`, `audit_logs`).
4. **Separation of Binary Storage:** Image files, photographs, and documents are stored in **Supabase Storage** (S3-compatible buckets). Only relative file paths, content types, byte sizes, and cryptographic hashes are persisted in the database.
5. **Separation of Public vs. Internal Communication:** Citizen-visible comments and internal departmental notes are strictly segregated using access-controlled attributes.

---

## 2. Preliminary Relational Schema Blueprint (14 Core Tables)

```
                         +-----------------------+
                         |     organizations     |
                         +-----------┬-----------+
                                     │ 1
                                     ├──────────────────────────────┐
                                     │ *                            │ *
                         +-----------▼-----------+      +-----------▼-----------+
                         |      departments      |      | complaint_categories  |
                         +-----------┬-----------+      +-----------┬-----------+
                                     │ 1                            │ 1
                                     │                              │
                         +-----------▼-----------+                  │
       +─────────────────┤   staff_memberships   │                  │
       │                 +-----------------------+                  │
       │ *                           │ *                            │
       │                             │                              │
+------▼------+                      │                  +-----------▼-----------+
|  profiles   |◄─────────────────────┴──────────────────┤      complaints       │
+------┬------+ 1                                       +-----------┬-----------+
       │                                                            │ 1
       │ 1                                  ┌───────────────────────┼──────────────────────┐
       │                                    │ *                     │ *                    │ *
+------▼-----------+             +----------▼----------+ +----------▼----------+ +---------▼---------+
|  notifications   |             |complaint_attachments| |complaint_assignments| |complaint_status_  |
+------------------+             +---------------------+ +---------------------+ |history            |
       │                                                            │            +-------------------+
       │ 1                                  ┌───────────────────────┼──────────────────────┐
       │                                    │ *                     │ 1                    │ 1
+------▼-----------+             +----------▼----------+ +----------▼----------+ +---------▼---------+
|    audit_logs    |             | complaint_comments  | | resolution_evidence | |complaint_feedback |
+------------------+             +---------------------+ +---------------------+ +-------------------+
```

---

### Table 1: `organizations`
* **Purpose:** Represents a municipal council, ward authority, residential township, or pilot testing entity (tenant root).
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `name VARCHAR(150) NOT NULL` (e.g., "Bengaluru East Ward Pilot")
  * `slug VARCHAR(60) NOT NULL UNIQUE` (e.g., "blr-east-pilot")
  * `contact_email VARCHAR(255) NOT NULL`
  * `contact_phone VARCHAR(20)`
  * `jurisdiction_boundary GEOMETRY(Polygon, 4326)` (Optional spatial boundary)
  * `is_active BOOLEAN NOT NULL DEFAULT true`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Constraints:** `UNIQUE (slug)`
* **Expected Indexes:**
  * `idx_organizations_slug` on `(slug)`
  * `idx_organizations_active` on `(is_active)`

---

### Table 2: `profiles`
* **Purpose:** Stores application user identity, tied 1:1 with `auth.users` managed by Supabase Auth.
* **Primary Key:** `id UUID REFERENCES auth.users(id) ON DELETE CASCADE`
* **Important Columns:**
  * `email VARCHAR(255) NOT NULL UNIQUE`
  * `full_name VARCHAR(120) NOT NULL`
  * `phone_number VARCHAR(20)`
  * `avatar_url TEXT`
  * `primary_role VARCHAR(40) NOT NULL DEFAULT 'CITIZEN'`  
    *(Allowed: 'CITIZEN', 'STAFF', 'SUPERVISOR', 'ORG_ADMIN', 'PLATFORM_ADMIN')*
  * `is_verified BOOLEAN NOT NULL DEFAULT false`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Constraints:** `CHECK (primary_role IN ('CITIZEN', 'STAFF', 'SUPERVISOR', 'ORG_ADMIN', 'PLATFORM_ADMIN'))`
* **Expected Indexes:**
  * `idx_profiles_email` on `(email)`
  * `idx_profiles_role` on `(primary_role)`

---

### Table 3: `departments`
* **Purpose:** Functional divisions within an organization (e.g., Roads & Infrastructure, Solid Waste, Streetlights).
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT`
  * `name VARCHAR(100) NOT NULL`
  * `code VARCHAR(20) NOT NULL` (e.g., "ROADS", "SAN", "ELEC")
  * `head_of_department_id UUID REFERENCES profiles(id) ON DELETE SET NULL`
  * `is_active BOOLEAN NOT NULL DEFAULT true`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Constraints:** `UNIQUE (organization_id, code)`
* **Expected Indexes:**
  * `idx_departments_org` on `(organization_id)`
  * `idx_departments_org_code` on `(organization_id, code)`

---

### Table 4: `staff_memberships`
* **Purpose:** Maps staff, supervisors, and admins to specific organizations and departments with role definitions.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
  * `organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT`
  * `department_id UUID REFERENCES departments(id) ON DELETE RESTRICT`
  * `assigned_role VARCHAR(40) NOT NULL`  
    *(Allowed: 'STAFF', 'SUPERVISOR', 'ORG_ADMIN')*
  * `is_available BOOLEAN NOT NULL DEFAULT true` (Field availability for work dispatch)
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Constraints:**  
  * `UNIQUE (profile_id, organization_id, department_id)`
  * `CHECK (assigned_role IN ('STAFF', 'SUPERVISOR', 'ORG_ADMIN'))`
* **Expected Indexes:**
  * `idx_staff_org_dept` on `(organization_id, department_id)`
  * `idx_staff_profile` on `(profile_id)`

---

### Table 5: `complaint_categories`
* **Purpose:** Configurable problem categories with assigned default departments, priority, and SLA turnaround targets.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT`
  * `department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT`
  * `name VARCHAR(100) NOT NULL` (e.g., "Potholes and Damaged Roads")
  * `description TEXT`
  * `default_priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM'` *(LOW, MEDIUM, HIGH, URGENT)*
  * `default_sla_hours INTEGER NOT NULL DEFAULT 48`
  * `icon_key VARCHAR(50)`
  * `is_active BOOLEAN NOT NULL DEFAULT true`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Constraints:** `UNIQUE (organization_id, name)`
* **Expected Indexes:**
  * `idx_categories_org` on `(organization_id)`
  * `idx_categories_active` on `(organization_id, is_active)`

---

### Table 6: `complaints`
* **Purpose:** Core entity storing the primary citizen grievance record.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `tracking_reference VARCHAR(30) NOT NULL UNIQUE` (e.g., `CF-2026-BLR-001042`)
  * `organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT`
  * `citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `category_id UUID NOT NULL REFERENCES complaint_categories(id) ON DELETE RESTRICT`
  * `department_id UUID REFERENCES departments(id) ON DELETE SET NULL`
  * `title VARCHAR(200) NOT NULL`
  * `description TEXT NOT NULL`
  * `status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED'`  
    *(Allowed: 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED', 'REJECTED', 'DUPLICATE')*
  * `priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM'`
  * `latitude DOUBLE PRECISION NOT NULL`
  * `longitude DOUBLE PRECISION NOT NULL`
  * `address_text TEXT NOT NULL`
  * `landmark TEXT`
  * `parent_complaint_id UUID REFERENCES complaints(id) ON DELETE SET NULL` (For duplicates)
  * `sla_due_at TIMESTAMPTZ`
  * `resolved_at TIMESTAMPTZ`
  * `closed_at TIMESTAMPTZ`
  * `reopen_count INTEGER NOT NULL DEFAULT 0`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Constraints:**  
  * `CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED', 'REJECTED', 'DUPLICATE'))`
  * `CHECK (latitude >= -90.0 AND latitude <= 90.0)`
  * `CHECK (longitude >= -180.0 AND longitude <= 180.0)`
* **Expected Indexes:**
  * `idx_complaints_tracking` on `(tracking_reference)`
  * `idx_complaints_org_status` on `(organization_id, status)`
  * `idx_complaints_citizen` on `(citizen_id)`
  * `idx_complaints_dept` on `(department_id)`
  * `idx_complaints_location` on `(latitude, longitude)` (or PostGIS GiST index)
  * `idx_complaints_created` on `(created_at DESC)`

---

### Table 7: `complaint_attachments`
* **Purpose:** Stores photographic evidence submitted by the citizen during initial reporting.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE`
  * `storage_path TEXT NOT NULL` (Relative path in Supabase Storage bucket)
  * `file_name VARCHAR(255) NOT NULL`
  * `file_type VARCHAR(50) NOT NULL` (e.g., 'image/jpeg', 'image/png')
  * `file_size_bytes INTEGER NOT NULL`
  * `is_verified BOOLEAN NOT NULL DEFAULT true`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Expected Indexes:**
  * `idx_attachments_complaint` on `(complaint_id)`

---

### Table 8: `complaint_assignments`
* **Purpose:** Tracks work order dispatch history, assigning staff members and recording reassignments.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE`
  * `staff_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `assigned_by_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `assignment_notes TEXT`
  * `is_current BOOLEAN NOT NULL DEFAULT true`
  * `assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  * `unassigned_at TIMESTAMPTZ`
* **Expected Indexes:**
  * `idx_assignments_complaint` on `(complaint_id)`
  * `idx_assignments_staff_current` on `(staff_id, is_current)`

---

### Table 9: `complaint_status_history`
* **Purpose:** Immutable append-only audit trail capturing every state transition of a complaint.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE`
  * `previous_status VARCHAR(30)`
  * `new_status VARCHAR(30) NOT NULL`
  * `acting_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `remarks TEXT`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Expected Indexes:**
  * `idx_status_history_complaint` on `(complaint_id, created_at ASC)`

---

### Table 10: `complaint_comments`
* **Purpose:** Stores conversation entries on a ticket, strictly separating public dialogue from internal staff notes.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE`
  * `author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `message TEXT NOT NULL`
  * `is_internal BOOLEAN NOT NULL DEFAULT false`  
    *(If true, visible ONLY to Staff, Supervisor, and Org Admin. Hidden from Citizen!)*
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Expected Indexes:**
  * `idx_comments_complaint_internal` on `(complaint_id, is_internal)`

---

### Table 11: `resolution_evidence`
* **Purpose:** Mandatory photographic and documentation evidence submitted by staff to prove remediation before closing.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE`
  * `resolved_by_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `evidence_storage_path TEXT NOT NULL`
  * `file_name VARCHAR(255) NOT NULL`
  * `completion_notes TEXT NOT NULL`
  * `submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Constraints:** `UNIQUE (complaint_id)` (One primary resolution record per ticket)
* **Expected Indexes:**
  * `idx_resolution_complaint` on `(complaint_id)`

---

### Table 12: `complaint_feedback`
* **Purpose:** Captures citizen satisfaction ratings and quality reviews upon issue completion.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE`
  * `citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)`
  * `feedback_text TEXT`
  * `is_satisfied BOOLEAN NOT NULL DEFAULT true`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Constraints:** `UNIQUE (complaint_id)` (Citizen can rate a complaint once per cycle)
* **Expected Indexes:**
  * `idx_feedback_complaint` on `(complaint_id)`
  * `idx_feedback_rating` on `(rating)`

---

### Table 13: `notifications`
* **Purpose:** Persists in-app user notifications for ticket milestones, assignment alerts, and system warnings.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
  * `complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE`
  * `title VARCHAR(150) NOT NULL`
  * `body TEXT NOT NULL`
  * `notification_type VARCHAR(50) NOT NULL`  
    *(e.g., 'STATUS_UPDATE', 'ASSIGNMENT', 'EVIDENCE_SUBMITTED', 'REOPENED')*
  * `is_read BOOLEAN NOT NULL DEFAULT false`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Expected Indexes:**
  * `idx_notifications_recipient_unread` on `(recipient_id, is_read)`

---

### Table 14: `audit_logs`
* **Purpose:** Comprehensive administrative compliance and security audit log tracking all privileged mutations.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Important Columns:**
  * `organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL`
  * `acting_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `action VARCHAR(80) NOT NULL` (e.g., 'STAFF_PROVISIONED', 'CATEGORY_DEACTIVATED', 'TICKET_OVERRIDE')
  * `resource_type VARCHAR(50) NOT NULL` (e.g., 'complaints', 'departments', 'staff_memberships')
  * `resource_id UUID`
  * `payload_diff JSONB` (Captures previous vs updated fields)
  * `ip_address VARCHAR(45)`
  * `user_agent TEXT`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
* **Expected Indexes:**
  * `idx_audit_logs_org` on `(organization_id, created_at DESC)`
  * `idx_audit_logs_user` on `(acting_user_id)`
  * `idx_audit_logs_resource` on `(resource_type, resource_id)`

---

## 3. Storage Architecture (Supabase Storage Buckets)

Binary assets (photographs, PDFs) are never stored directly in PostgreSQL database columns. Instead, Supabase Storage buckets manage physical storage:

| Bucket Name | Access Level | Contents & Retention Policy | Access Control Policy |
| :--- | :--- | :--- | :--- |
| **`complaints-media`** | Public Read (or Presigned Read) | Citizen-uploaded complaint photos.<br>Path format: `org_{org_id}/complaints/{complaint_id}/{file_id}.jpg` | Write: Authenticated citizen via presigned URL.<br>Read: Publicly accessible or signed URL. |
| **`resolution-evidence`** | Restricted Read | Staff resolution proof photos.<br>Path format: `org_{org_id}/resolutions/{complaint_id}/{file_id}.jpg` | Write: Assigned Staff / Supervisor only.<br>Read: Citizen, Staff, Supervisor, Admins. |
| **`avatars`** | Public Read | User profile pictures.<br>Path format: `avatars/{profile_id}.jpg` | Write: Profile owner only. Read: Public. |

---

## 4. Separation of Public Comments vs. Internal Staff Notes

A recurring security and privacy vulnerability in civic tracking platforms is field technicians' internal notes (e.g., "Awaiting asphalt supply delivery", "Citizen location inaccurate, contact contractor") leaking to the public citizen tracker.

CivicFix solves this at both the schema and query layers:
1. `complaint_comments` table includes an `is_internal BOOLEAN NOT NULL DEFAULT false` flag.
2. In the Node.js API layer:
   ```javascript
   // When querying comments for a Citizen requester:
   const query = supabase
     .from('complaint_comments')
     .select('*')
     .eq('complaint_id', complaintId)
     .eq('is_internal', false); // HARD ENFORCED FILTER

   // When querying comments for a Staff/Supervisor/Admin requester:
   const query = supabase
     .from('complaint_comments')
     .select('*')
     .eq('complaint_id', complaintId); // Retrieves both
   ```
3. PostgreSQL RLS policies will reinforce this on Day 5 as an additional safety guard.

---

## 5. Potential Database Pitfalls & Engineering Mitigations

| Identified Pitfall | Potential Risk | Engineering Mitigation in CivicFix |
| :--- | :--- | :--- |
| **Simultaneous Double Assignment** | Two supervisors assign different staff to the same ticket simultaneously. | PostgreSQL transactional update: `UPDATE complaints SET status = 'ASSIGNED' WHERE id = $1 AND status = 'VERIFIED'`. If rows affected is 0, reject with HTTP 409 Conflict. |
| **Cascading Deletes Deleting History** | Deleting a user profile could cascade and delete status histories or complaints. | Crucial tables use `ON DELETE RESTRICT` for user foreign keys (`acting_user_id`, `citizen_id`, `staff_id`), preserving audit logs permanently. |
| **Slow Geospatial Radius Queries** | High query latency when filtering nearby complaints within 2km across thousands of rows. | Store coordinates as `DOUBLE PRECISION` with composite index `(latitude, longitude)`, and configure PostGIS `GEOMETRY(Point, 4326)` with a GiST spatial index. |
| **Orphaned File Storage Leaks** | A user uploads an image to Supabase Storage but aborts ticket creation before submitting. | Node.js cleanup cron / lifecycle function flags attachments not linked to any complaint ID after 24 hours. |
| **Unbounded JSON Growth in Audit Logs** | Massive diff payloads degrading disk space and query performance. | Restrict `payload_diff` to top-level changed key-value pairs; avoid serializing full nested object trees. |
