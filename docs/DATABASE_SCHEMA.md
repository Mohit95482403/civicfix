# CivicFix PostgreSQL Database Schema Specification
**Document Version:** 2.0.0  
**Phase:** Day 4: Production-Minded Database Architecture, PostgreSQL Schema, Migrations, RLS & Seed Data  
**Status:** Approved & Implemented Baseline  

---

## 1. Domain ENUM Specifications

| ENUM Name | Permitted Values | Architectural Purpose |
| :--- | :--- | :--- |
| `complaint_status` | `SUBMITTED`, `UNDER_REVIEW`, `VERIFIED`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `REOPENED`, `REJECTED`, `DUPLICATE` | 10 canonical complaint lifecycle states. |
| `complaint_priority` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` | Work order severity and SLA escalation flag. |
| `staff_role` | `STAFF`, `SUPERVISOR`, `ORG_ADMIN` | Organization-scoped role hierarchy (`ORG_ADMIN` > `SUPERVISOR` > `STAFF`). |
| `attachment_type` | `COMPLAINT_PHOTO`, `RESOLUTION_PROOF`, `OTHER` | Classification of files stored in Supabase Storage. |
| `comment_visibility` | `CITIZEN_VISIBLE`, `INTERNAL_ONLY` | Strict segregation of public updates vs internal municipal notes. |
| `notification_type` | `STATUS_UPDATE`, `ASSIGNMENT`, `COMMENT`, `SLA_WARNING`, `SYSTEM` | Categorization for in-app and FCM push notifications. |

---

## 2. Table-by-Table Technical Specifications

### Table 1: `organizations`
* **Purpose:** Multi-tenant root entity representing municipal corporations, city councils, or pilot wards.
* **Primary Key:** `id UUID DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `name VARCHAR(150) NOT NULL`
  * `slug VARCHAR(60) NOT NULL UNIQUE`
  * `code VARCHAR(10) NOT NULL UNIQUE` (e.g., `BLR`, `PUN`)
  * `description TEXT`
  * `contact_email VARCHAR(255)`
  * `contact_phone VARCHAR(25)`
  * `is_active BOOLEAN NOT NULL DEFAULT true`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:** `chk_organizations_code_format CHECK (code ~ '^[A-Z0-9]{2,10}$')`
* **Indexes:** `idx_organizations_slug (slug)`, `idx_organizations_is_active (is_active)`
* **Deletion Policy:** Parent root; child departments, staff, and complaints restrict deletion (`ON DELETE RESTRICT`).

---

### Table 2: `profiles`
* **Purpose:** Stores user identity, mapped 1:1 with `auth.users` managed by Supabase Auth.
* **Primary Key:** `id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
* **Columns:**
  * `id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
  * `email VARCHAR(255) NOT NULL UNIQUE`
  * `full_name VARCHAR(120) NOT NULL`
  * `phone_number VARCHAR(25)`
  * `avatar_path TEXT`
  * `preferred_language VARCHAR(10) NOT NULL DEFAULT 'en'`
  * `is_active BOOLEAN NOT NULL DEFAULT true`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:** `chk_profiles_language CHECK (preferred_language IN ('en', 'kn', 'hi', 'mr', 'ta', 'te'))`
* **Indexes:** `idx_profiles_email (email)`, `idx_profiles_is_active (is_active)`
* **Trigger:** Auto-provisioned on signup via `trg_on_auth_user_created` (`handle_new_user()`).

---

### Table 3: `departments`
* **Purpose:** Functional divisions within an organization (Roads, Solid Waste, Electrical, Water).
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT`
  * `name VARCHAR(120) NOT NULL`
  * `slug VARCHAR(60) NOT NULL`
  * `code VARCHAR(20) NOT NULL`
  * `description TEXT`
  * `is_active BOOLEAN NOT NULL DEFAULT true`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:** `UNIQUE (organization_id, slug)`, `UNIQUE (organization_id, code)`
* **Indexes:** `idx_departments_organization_id (organization_id)`, `idx_departments_is_active (is_active)`

---

### Table 4: `staff_memberships`
* **Purpose:** Maps users to organizations and departments with designated roles.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
  * `organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT`
  * `department_id UUID REFERENCES departments(id) ON DELETE SET NULL`
  * `role staff_role NOT NULL DEFAULT 'STAFF'`
  * `is_active BOOLEAN NOT NULL DEFAULT true`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:** `UNIQUE (user_id, organization_id)`
* **Indexes:** `idx_staff_memberships_user_id (user_id)`, `idx_staff_memberships_org_role (organization_id, role)`, `idx_staff_memberships_dept_id (department_id)`

---

### Table 5: `platform_administrators`
* **Purpose:** Explicit separation of global superusers from organization-scoped admins.
* **Primary Key:** `user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE`
* **Columns:**
  * `user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE`
  * `granted_by UUID REFERENCES profiles(id)`
  * `granted_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `notes TEXT`

---

### Table 6: `complaint_categories`
* **Purpose:** Configurable civic problem categories with default SLAs and departmental routing.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE` (NULL for global templates)
  * `department_id UUID REFERENCES departments(id) ON DELETE SET NULL`
  * `name VARCHAR(120) NOT NULL`
  * `slug VARCHAR(60) NOT NULL`
  * `description TEXT`
  * `icon_key VARCHAR(50) NOT NULL DEFAULT 'alert-circle'`
  * `sla_hours INTEGER NOT NULL DEFAULT 48`
  * `priority complaint_priority NOT NULL DEFAULT 'HIGH'`
  * `sort_order INTEGER NOT NULL DEFAULT 0`
  * `is_active BOOLEAN NOT NULL DEFAULT true`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:** `chk_categories_sla_positive CHECK (sla_hours > 0)`, `UNIQUE NULLS NOT DISTINCT (organization_id, slug)`
* **Indexes:** `idx_complaint_categories_org (organization_id)`, `idx_complaint_categories_dept (department_id)`

---

### Table 7: `complaints`
* **Purpose:** Central entity representing a reported civic infrastructure problem.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `reference_number VARCHAR(35) NOT NULL UNIQUE` (e.g. `CF-2026-BLR-001042`)
  * `organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT`
  * `citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `category_id UUID NOT NULL REFERENCES complaint_categories(id) ON DELETE RESTRICT`
  * `title VARCHAR(200) NOT NULL`
  * `description TEXT NOT NULL`
  * `status complaint_status NOT NULL DEFAULT 'SUBMITTED'`
  * `priority complaint_priority NOT NULL DEFAULT 'HIGH'`
  * `latitude NUMERIC(10, 7)`
  * `longitude NUMERIC(10, 7)`
  * `address_text TEXT`
  * `location_description TEXT`
  * `submitted_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `sla_due_at TIMESTAMPTZ`
  * `resolved_at TIMESTAMPTZ`
  * `closed_at TIMESTAMPTZ`
  * `reopened_at TIMESTAMPTZ`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:**
  * `chk_complaints_title_length CHECK (char_length(trim(title)) >= 5)`
  * `chk_complaints_description_length CHECK (char_length(trim(description)) >= 10)`
  * `chk_complaints_coords_range CHECK ((latitude BETWEEN -90.0 AND 90.0) AND (longitude BETWEEN -180.0 AND 180.0))`
  * `chk_complaints_coords_pair CHECK ((latitude IS NULL AND longitude IS NULL) OR (latitude IS NOT NULL AND longitude IS NOT NULL))`
* **Indexes:**
  * `idx_complaints_org_status (organization_id, status)`
  * `idx_complaints_citizen_created (citizen_id, created_at DESC)`
  * `idx_complaints_category_status (category_id, status)`
  * `idx_complaints_reference_number (reference_number)`
  * `idx_complaints_sla_active (sla_due_at) WHERE status NOT IN ('RESOLVED', 'CLOSED', 'REJECTED')`

---

### Table 8: `complaint_attachments`
* **Purpose:** Metadata pointing to citizen photos and files in private Supabase Storage buckets.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE`
  * `uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `storage_path TEXT NOT NULL`
  * `original_filename VARCHAR(255)`
  * `mime_type VARCHAR(100) NOT NULL`
  * `file_size_bytes BIGINT NOT NULL`
  * `attachment_type attachment_type NOT NULL DEFAULT 'COMPLAINT_PHOTO'`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:**
  * `chk_attachment_file_size CHECK (file_size_bytes > 0 AND file_size_bytes <= 10485760)` (10MB max)
  * `chk_attachment_mime_type CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'image/heic'))`
* **Indexes:** `idx_attachments_complaint_id (complaint_id)`, `idx_attachments_uploaded_by (uploaded_by)`

---

### Table 9: `complaint_assignments`
* **Purpose:** Work order delegation to field technicians with immutable delegation history.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE RESTRICT`
  * `organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT`
  * `department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT`
  * `assigned_to UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `assigned_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `assigned_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `unassigned_at TIMESTAMPTZ`
  * `notes TEXT`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:**
  * `uq_active_complaint_assignment UNIQUE (complaint_id) WHERE unassigned_at IS NULL` (Single active assignee rule)
  * `chk_assignment_unassigned_after_assigned CHECK (unassigned_at IS NULL OR unassigned_at >= assigned_at)`
* **Indexes:** `idx_assignments_assigned_to_active (assigned_to) WHERE unassigned_at IS NULL`, `idx_assignments_complaint_id (complaint_id)`

---

### Table 10: `complaint_status_history`
* **Purpose:** Immutable append-only audit trail recording every workflow state transition.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE RESTRICT`
  * `previous_status complaint_status`
  * `new_status complaint_status NOT NULL`
  * `changed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `reason TEXT`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Indexes:** `idx_status_history_complaint_date (complaint_id, created_at DESC)`

---

### Table 11: `complaint_comments`
* **Purpose:** Public citizen communication threads and private internal staff notes.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE`
  * `author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `body TEXT NOT NULL`
  * `visibility comment_visibility NOT NULL DEFAULT 'CITIZEN_VISIBLE'`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:** `chk_comments_body_not_empty CHECK (char_length(trim(body)) >= 1)`
* **Indexes:** `idx_comments_complaint_date (complaint_id, created_at ASC)`, `idx_comments_visibility (visibility)`

---

### Table 12: `resolution_evidence`
* **Purpose:** Mandatory proof-of-work submitted by technician before a ticket can be resolved.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE RESTRICT`
  * `submitted_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `description TEXT NOT NULL`
  * `attachment_id UUID REFERENCES complaint_attachments(id) ON DELETE SET NULL`
  * `verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL`
  * `verified_at TIMESTAMPTZ`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:** `chk_resolution_desc_length CHECK (char_length(trim(description)) >= 5)`
* **Indexes:** `idx_resolution_evidence_complaint (complaint_id)`

---

### Table 13: `complaint_feedback`
* **Purpose:** Citizen 1–5 star rating and feedback submitted after resolution.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE RESTRICT`
  * `citizen_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT`
  * `rating INTEGER NOT NULL`
  * `comment TEXT`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
  * `updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Constraints:**
  * `chk_feedback_rating_range CHECK (rating BETWEEN 1 AND 5)`
  * `uq_complaint_citizen_feedback UNIQUE (complaint_id, citizen_id)`
* **Indexes:** `idx_feedback_complaint_id (complaint_id)`, `idx_feedback_rating (rating)`

---

### Table 14: `notifications`
* **Purpose:** In-app notification queue for status changes and assignments.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
  * `complaint_id UUID REFERENCES complaints(id) ON DELETE SET NULL`
  * `type notification_type NOT NULL DEFAULT 'STATUS_UPDATE'`
  * `title VARCHAR(200) NOT NULL`
  * `body TEXT NOT NULL`
  * `read_at TIMESTAMPTZ`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Indexes:** `idx_notifications_recipient_unread (recipient_id, created_at DESC) WHERE read_at IS NULL`

---

### Table 15: `audit_logs`
* **Purpose:** Immutable governance audit log compliant with India DPDP Act and civic accountability.
* **Primary Key:** `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
* **Columns:**
  * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  * `actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL`
  * `organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL`
  * `action VARCHAR(80) NOT NULL`
  * `entity_type VARCHAR(60) NOT NULL`
  * `entity_id VARCHAR(80) NOT NULL`
  * `metadata JSONB DEFAULT '{}'::jsonb`
  * `ip_address VARCHAR(45)`
  * `user_agent TEXT`
  * `created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()`
* **Indexes:** `idx_audit_logs_org_date (organization_id, created_at DESC)`, `idx_audit_logs_actor (actor_id)`
