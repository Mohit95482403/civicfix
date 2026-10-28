# CivicFix Database Entity Relationships Specification

**Document Version:** 2.0.0  
**Phase:** Day 4 — Production-Minded Database Architecture, PostgreSQL Schema, Migrations, RLS & Seed Data  
**Status:** Approved & Implemented Baseline  

---

## 1. Visual Entity-Relationship Diagram (Mermaid ER)

The following diagram represents the 14 core relational entities, Supabase Auth user integration, and audit boundaries implemented in [database/migrations/](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/database/migrations).

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : "1:1 cascades on delete"
    PROFILES ||--o| PLATFORM_ADMINISTRATORS : "global superuser"
    ORGANIZATIONS ||--o{ DEPARTMENTS : "contains"
    ORGANIZATIONS ||--o{ STAFF_MEMBERSHIPS : "employs"
    ORGANIZATIONS ||--o{ COMPLAINT_CATEGORIES : "configures"
    ORGANIZATIONS ||--o{ COMPLAINTS : "jurisdiction over"
    
    PROFILES ||--o{ STAFF_MEMBERSHIPS : "assigned to"
    DEPARTMENTS ||--o{ STAFF_MEMBERSHIPS : "allocated to"
    DEPARTMENTS ||--o{ COMPLAINT_CATEGORIES : "default route"
    
    PROFILES ||--o{ COMPLAINTS : "submits as citizen"
    COMPLAINT_CATEGORIES ||--o{ COMPLAINTS : "classifies"
    
    COMPLAINTS ||--o{ COMPLAINT_ATTACHMENTS : "initial photo evidence"
    PROFILES ||--o{ COMPLAINT_ATTACHMENTS : "uploaded by"
    
    COMPLAINTS ||--o{ COMPLAINT_ASSIGNMENTS : "delegation history"
    ORGANIZATIONS ||--o{ COMPLAINT_ASSIGNMENTS : "scoped to"
    DEPARTMENTS ||--o{ COMPLAINT_ASSIGNMENTS : "dispatched to"
    PROFILES ||--o{ COMPLAINT_ASSIGNMENTS : "assigned technician"
    PROFILES ||--o{ COMPLAINT_ASSIGNMENTS : "supervisor assigner"
    
    COMPLAINTS ||--o{ COMPLAINT_STATUS_HISTORY : "immutable transitions"
    PROFILES ||--o{ COMPLAINT_STATUS_HISTORY : "actor who changed status"
    
    COMPLAINTS ||--o{ COMPLAINT_COMMENTS : "threaded discussion"
    PROFILES ||--o{ COMPLAINT_COMMENTS : "comment author"
    
    COMPLAINTS ||--o{ RESOLUTION_EVIDENCE : "proof of work"
    PROFILES ||--o{ RESOLUTION_EVIDENCE : "submitted by staff"
    COMPLAINT_ATTACHMENTS ||--o| RESOLUTION_EVIDENCE : "proof photo link"
    PROFILES ||--o| RESOLUTION_EVIDENCE : "supervisor verified by"
    
    COMPLAINTS ||--o| COMPLAINT_FEEDBACK : "post-resolution rating (1:1)"
    PROFILES ||--o{ COMPLAINT_FEEDBACK : "submitted by citizen"
    
    PROFILES ||--o{ NOTIFICATIONS : "recipient"
    COMPLAINTS ||--o| NOTIFICATIONS : "related ticket"
    
    PROFILES ||--o{ AUDIT_LOGS : "actor"
    ORGANIZATIONS ||--o{ AUDIT_LOGS : "organization context"

    PROFILES {
        UUID id PK
        VARCHAR email UK
        VARCHAR full_name
        VARCHAR phone_number
        TEXT avatar_path
        VARCHAR preferred_language
        BOOLEAN is_active
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    ORGANIZATIONS {
        UUID id PK
        VARCHAR name
        VARCHAR slug UK
        VARCHAR code UK
        TEXT description
        VARCHAR contact_email
        VARCHAR contact_phone
        BOOLEAN is_active
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    DEPARTMENTS {
        UUID id PK
        UUID organization_id FK
        VARCHAR name
        VARCHAR slug
        VARCHAR code
        TEXT description
        BOOLEAN is_active
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    STAFF_MEMBERSHIPS {
        UUID id PK
        UUID user_id FK
        UUID organization_id FK
        UUID department_id FK
        staff_role role
        BOOLEAN is_active
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    PLATFORM_ADMINISTRATORS {
        UUID user_id PK, FK
        UUID granted_by FK
        TIMESTAMPTZ granted_at
        TEXT notes
    }

    COMPLAINT_CATEGORIES {
        UUID id PK
        UUID organization_id FK
        UUID department_id FK
        VARCHAR name
        VARCHAR slug
        TEXT description
        VARCHAR icon_key
        INTEGER sla_hours
        complaint_priority priority
        INTEGER sort_order
        BOOLEAN is_active
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    COMPLAINTS {
        UUID id PK
        VARCHAR reference_number UK
        UUID organization_id FK
        UUID citizen_id FK
        UUID category_id FK
        VARCHAR title
        TEXT description
        complaint_status status
        complaint_priority priority
        NUMERIC latitude
        NUMERIC longitude
        TEXT address_text
        TEXT location_description
        TIMESTAMPTZ submitted_at
        TIMESTAMPTZ sla_due_at
        TIMESTAMPTZ resolved_at
        TIMESTAMPTZ closed_at
        TIMESTAMPTZ reopened_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    COMPLAINT_ATTACHMENTS {
        UUID id PK
        UUID complaint_id FK
        UUID uploaded_by FK
        TEXT storage_path
        VARCHAR original_filename
        VARCHAR mime_type
        BIGINT file_size_bytes
        attachment_type attachment_type
        TIMESTAMPTZ created_at
    }

    COMPLAINT_ASSIGNMENTS {
        UUID id PK
        UUID complaint_id FK
        UUID organization_id FK
        UUID department_id FK
        UUID assigned_to FK
        UUID assigned_by FK
        TIMESTAMPTZ assigned_at
        TIMESTAMPTZ unassigned_at
        TEXT notes
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    COMPLAINT_STATUS_HISTORY {
        UUID id PK
        UUID complaint_id FK
        complaint_status previous_status
        complaint_status new_status
        UUID changed_by FK
        TEXT reason
        TIMESTAMPTZ created_at
    }

    COMPLAINT_COMMENTS {
        UUID id PK
        UUID complaint_id FK
        UUID author_id FK
        TEXT body
        comment_visibility visibility
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    RESOLUTION_EVIDENCE {
        UUID id PK
        UUID complaint_id FK
        UUID submitted_by FK
        TEXT description
        UUID attachment_id FK
        UUID verified_by FK
        TIMESTAMPTZ verified_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    COMPLAINT_FEEDBACK {
        UUID id PK
        UUID complaint_id FK
        UUID citizen_id FK
        INTEGER rating
        TEXT comment
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    NOTIFICATIONS {
        UUID id PK
        UUID recipient_id FK
        UUID complaint_id FK
        notification_type type
        VARCHAR title
        TEXT body
        TIMESTAMPTZ read_at
        TIMESTAMPTZ created_at
    }

    AUDIT_LOGS {
        UUID id PK
        UUID actor_id FK
        UUID organization_id FK
        VARCHAR action
        VARCHAR entity_type
        VARCHAR entity_id
        JSONB metadata
        VARCHAR ip_address
        TEXT user_agent
        TIMESTAMPTZ created_at
    }
```

---

## 2. Foreign Key Deletion Policy Matrix

In a civic reporting system, arbitrary `CASCADE` deletions can destroy legal audit trails, evidence, and municipal accountability. The CivicFix deletion policies are designed with deliberate preservation:

| Source Entity | Foreign Key Column | Target Entity | On Delete Action | Architectural Justification |
| :--- | :--- | :--- | :--- | :--- |
| `profiles` | `id` | `auth.users(id)` | `CASCADE` | If a Supabase Auth user is permanently purged from Auth, their base profile shell is removed. |
| `platform_administrators` | `user_id` | `profiles(id)` | `CASCADE` | If user profile is deleted, superuser status automatically revokes. |
| `departments` | `organization_id` | `organizations(id)` | `RESTRICT` | An organization with established municipal departments cannot be accidentally dropped. |
| `staff_memberships` | `user_id` | `profiles(id)` | `CASCADE` | Deleting a user purges their internal employment record. |
| `staff_memberships` | `organization_id` | `organizations(id)` | `RESTRICT` | Cannot delete an organization while staff contracts exist. |
| `staff_memberships` | `department_id` | `departments(id)` | `SET NULL` | If a department is reorganized/dissolved, staff remain in the parent organization unassigned. |
| `complaint_categories` | `organization_id` | `organizations(id)` | `CASCADE` | If an organization is decommissioned, its custom categories are cleaned up. |
| `complaint_categories` | `department_id` | `departments(id)` | `SET NULL` | If a department dissolves, category defaults route to unassigned municipal queue. |
| `complaints` | `organization_id` | `organizations(id)` | `RESTRICT` | Active or historical civic complaints prevent accidental deletion of a city ward/body. |
| `complaints` | `citizen_id` | `profiles(id)` | `RESTRICT` | Citizen cannot purge their profile if active complaints require historical accountability. |
| `complaints` | `category_id` | `complaint_categories(id)` | `RESTRICT` | Cannot delete a civic category while open complaints depend on its classification. |
| `complaint_attachments` | `complaint_id` | `complaints(id)` | `CASCADE` | If a draft/invalid complaint is purged, its photo metadata records are cleared. |
| `complaint_attachments` | `uploaded_by` | `profiles(id)` | `RESTRICT` | Uploader identity must be preserved for audit accountability. |
| `complaint_assignments` | `complaint_id` | `complaints(id)` | `RESTRICT` | Delegation history must remain intact for municipal dispute resolution. |
| `complaint_assignments` | `assigned_to` | `profiles(id)` | `RESTRICT` | Prevents deleting staff accounts with pending or historical assignments. |
| `complaint_status_history`| `complaint_id` | `complaints(id)` | `RESTRICT` | Immutable status transition records cannot be orphaned or deleted. |
| `complaint_comments` | `complaint_id` | `complaints(id)` | `CASCADE` | Discussion comments belong to complaint lifecycle; purge with ticket if complaint is pruned. |
| `complaint_comments` | `author_id` | `profiles(id)` | `RESTRICT` | Author of comment or internal note cannot be deleted while messages persist. |
| `resolution_evidence` | `complaint_id` | `complaints(id)` | `RESTRICT` | Proof-of-work resolution records are legal municipal assets; cannot be dropped. |
| `resolution_evidence` | `attachment_id` | `complaint_attachments(id)`| `SET NULL` | If attachment reference is unlinked, text resolution description remains. |
| `complaint_feedback` | `complaint_id` | `complaints(id)` | `RESTRICT` | Citizen rating and service review cannot be pruned. |
| `notifications` | `recipient_id` | `profiles(id)` | `CASCADE` | In-app alerts are transient user data; purge when profile is deleted. |
| `notifications` | `complaint_id` | `complaints(id)` | `SET NULL` | If a ticket is archived, notification remains as historical alert. |
| `audit_logs` | `actor_id` | `profiles(id)` | `SET NULL` | DPDP compliance: if user invokes "Right to be Forgotten", audit records preserve action with anonymized actor. |
| `audit_logs` | `organization_id` | `organizations(id)` | `SET NULL` | Governance event stays in system even if organizational restructure occurs. |

---

## 3. Cardinality & Multiplicity Rules

1. **One-to-One (1:1):**
   * `auth.users` ↔ `profiles`: Each authenticated identity has exactly one application profile.
   * `complaints` ↔ `complaint_feedback`: Each complaint accepts at most one feedback record per citizen (`UNIQUE (complaint_id, citizen_id)`).
   * `complaints` ↔ Active `complaint_assignments`: At any moment in time, a complaint can have at most one active assignee (`WHERE unassigned_at IS NULL`).

2. **One-to-Many (1:N):**
   * `organizations` → `departments`: An organization has 0 to N departments.
   * `organizations` → `complaints`: An organization manages 0 to N civic complaints.
   * `complaints` → `complaint_attachments`: A complaint can have 1 to 5 uploaded photos.
   * `complaints` → `complaint_status_history`: A complaint accumulates 1 to N immutable lifecycle state transitions.
   * `complaints` → `complaint_comments`: A complaint thread accumulates public citizen updates and internal notes.

3. **Many-to-Many (M:N) Normalized Relationships:**
   * `profiles` ↔ `organizations`: Linked via `staff_memberships` table with specific organizational role (`STAFF`, `SUPERVISOR`, `ORG_ADMIN`).
   * A citizen user may have memberships across multiple organizations or serve as staff in one and citizen in another without duplicating identity profiles.
