# User Roles & Access Control Specification
## Project: CivicFix — Civic Problem Reporting & Resolution Tracking Platform
**Document Version:** 1.0.0  
**Phase:** Day 1: Project Planning, Requirements Engineering & System Architecture  
**Status:** Approved Baseline  

---

## 1. Role Taxonomy Overview

CivicFix defines **five distinct hierarchical roles** across two primary operational domains: **Public Citizen Space** and **Internal Municipal / Operational Space**.

```
[ Platform Administrator ] ◄── Global Platform Scope (Multi-Organization)
          │
          ▼
[ Organization Administrator ] ◄── Organization Tenant Scope
          │
          ▼
[ Department Supervisor ] ◄── Departmental Operational Scope
          │
          ▼
[ Field Staff ] ◄── Assigned Task Scope

────────────────────────────────────────────────────────────────────────
[ Citizen ] ◄── Public User Scope (Self-Owned Complaints & Nearby Public View)
```

---

## 2. Detailed Role Profiles & Operational Boundaries

---

### 2.1 Citizen (`CITIZEN`)
* **Scope:** Public / Personal
* **Account Creation:** Self-registration enabled via mobile application or web portal.
* **Core Responsibilities:**
  * Report civic failures with photographs, GPS location, and problem descriptions.
  * Track personal complaints through an interactive timeline.
  * Receive real-time push notifications when complaint status changes.
  * Post public inquiries/clarifications on their own complaints.
  * Review completed work, submit 1-5 star ratings, and provide satisfaction reviews.
  * Request ticket reopening within 48 hours if repairs are substandard.
* **Strict Restrictions:**
  * Cannot view internal staff notes or field personnel phone numbers.
  * Cannot modify complaint status directly (e.g., cannot mark own ticket `IN_PROGRESS` or `RESOLVED`).
  * Cannot access admin panels, staff dashboards, or departmental metrics.
  * Cannot view other citizens' private contact information.

---

### 2.2 Field Staff (`STAFF`)
* **Scope:** Departmental / Assigned Workload
* **Account Creation:** **No self-registration.** Must be provisioned by an authorized Organization Administrator.
* **Core Responsibilities:**
  * View personal queue of assigned work orders.
  * Update ticket status from `ASSIGNED` to `IN_PROGRESS` upon arriving on site.
  * Add internal departmental progress notes (visible only to staff/supervisors).
  * Upload mandatory photographic proof of resolution and completion notes.
  * Submit ticket for `RESOLVED` status transition.
* **Strict Restrictions:**
  * Cannot self-assign or reassign tickets to other staff members.
  * Cannot reject or verify incoming complaints.
  * Cannot modify problem categories, departments, or SLA thresholds.
  * Cannot access tickets belonging to other municipal departments.

---

### 2.3 Department Supervisor (`SUPERVISOR`)
* **Scope:** Departmental Scope (within designated Organization)
* **Account Creation:** Provisioned by Organization Administrator.
* **Core Responsibilities:**
  * Triage incoming departmental complaints: evaluate validity, verify problem authenticity, or reject with documented rationale.
  * Assign verified complaints to available field technicians.
  * Reassign tickets between staff members when workload balancing or reassignment is required.
  * Review overdue tickets and SLA breach warnings.
  * Evaluate citizen reopening requests; determine whether to re-dispatch or finalize closure.
* **Strict Restrictions:**
  * Cannot create or delete departments.
  * Cannot modify organization-wide configuration or global categories outside their department.
  * Cannot access other organizations' data.

---

### 2.4 Organization Administrator (`ORG_ADMIN`)
* **Scope:** Single Organization / Municipality / Pilot Tenant
* **Account Creation:** Provisioned by Platform Administrator during organization onboarding.
* **Core Responsibilities:**
  * Create, edit, and manage municipal departments (e.g., Roads, Sanitation, Streetlighting).
  * Provision and manage staff and supervisor accounts.
  * Configure problem categories, default priority levels, and SLA turnaround hours.
  * Monitor organization-wide analytics, SLA compliance rates, and citizen satisfaction scores.
  * Review immutable audit logs of all operational actions within the organization.
* **Strict Restrictions:**
  * **Strict Multi-Tenant Isolation:** Cannot view, access, or modify complaints, staff, or settings belonging to another organization.
  * Cannot create new organization tenants or modify platform-wide billing/subscription configurations.

---

### 2.5 Platform Administrator (`PLATFORM_ADMIN`)
* **Scope:** Global System-Wide / Multi-Tenant
* **Account Creation:** Initial deployment bootstrapping / direct platform owner access.
* **Core Responsibilities:**
  * Onboard new municipal organizations and pilot partner entities.
  * Manage global system configurations, rate limits, and service integrations (FCM, Maps).
  * Monitor platform-level operational health, database performance, and error telemetry.
  * Perform global security audits and compliance reviews.
* **Strict Restrictions:**
  * Does not interfere with day-to-day municipal complaint triage unless requested for technical support.

---

## 3. Comprehensive CRUD Permissions Matrix

| Resource / Action | Citizen | Staff | Supervisor | Org Admin | Platform Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Submit Complaint** | **Create** | — | — | — | — |
| **View Own Complaints** | **Read** | — | — | — | — |
| **View Assigned Complaints** | — | **Read** | **Read** (Dept) | **Read** (Org) | **Read** (All) |
| **Triage / Reject Complaint** | — | — | **Update** (Dept) | **Update** (Org) | **Update** (All) |
| **Assign / Reassign Complaint** | — | — | **Update** (Dept) | **Update** (Org) | — |
| **Mark `IN_PROGRESS`** | — | **Update** (Assigned) | **Update** (Dept) | **Update** (Org) | — |
| **Submit Resolution Evidence** | — | **Create** (Assigned) | **Create** (Dept) | **Create** (Org) | — |
| **Post Public Comment** | **Create** (Own) | **Create** (Assigned)| **Create** (Dept) | **Create** (Org) | — |
| **Post Internal Staff Note** | — | **Create** (Dept) | **Create** (Dept) | **Create** (Org) | — |
| **View Internal Staff Notes** | — | **Read** (Dept) | **Read** (Dept) | **Read** (Org) | **Read** (All) |
| **Submit Feedback & Rating** | **Create** (Own) | — | — | — | — |
| **Request Reopening (< 48h)** | **Create** (Own) | — | — | — | — |
| **Manage Departments** | — | — | — | **Full CRUD** | **Full CRUD** |
| **Manage Categories & SLAs** | — | — | — | **Full CRUD** | **Full CRUD** |
| **Provision Staff Accounts** | — | — | — | **Create / Update** | **Full CRUD** |
| **View Audit Logs** | — | — | — | **Read** (Org) | **Read** (All) |
| **Onboard New Organization** | — | — | — | — | **Full CRUD** |

---

## 4. Anti-Privilege Escalation Architectural Guarantees

Preventing unauthorized privilege escalation is a fundamental architectural requirement in CivicFix.

### 4.1 Principle of Zero Frontend Trust
1. **Never Trust Client-Supplied Roles:** The frontend application state, localStorage, cookies, and HTTP request bodies containing role keys (e.g. `{"role": "ORG_ADMIN"}`) are completely disregarded by the backend API.
2. **Database-Resolved Roles:** The authenticated user's active role is extracted from their verified Supabase Auth JWT identity and cross-referenced with the server-side `profiles` and `staff_memberships` tables in PostgreSQL:
   ```javascript
   // Backend Middleware Flow:
   const token = req.headers.authorization?.split(' ')[1];
   const { user, error } = await supabase.auth.getUser(token);
   if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

   // Server queries authoritative role from database:
   const profile = await db.query(
     'SELECT primary_role FROM profiles WHERE id = $1',
     [user.id]
   );
   req.user = { id: user.id, role: profile.rows[0].primary_role };
   ```

### 4.2 Immutable Role Fields in User Profile
The citizen-facing endpoint `PUT /api/v1/auth/profile` uses strict schema whitelisting. Only `full_name`, `phone_number`, and `avatar_url` can be modified. Attempting to submit `primary_role` or `organization_id` results in immediate request rejection (`HTTP 422 Unprocessable Entity`).

### 4.3 Controlled Staff Provisioning Pipeline
1. Field staff and administrative accounts cannot be created via the public registration screen.
2. Only an authenticated user possessing the `ORG_ADMIN` or `PLATFORM_ADMIN` role can invoke `POST /api/v1/admin/staff/provision`.
3. The server generates a temporary password and records an explicit event in `audit_logs` capturing `acting_user_id`, `new_staff_id`, `department_id`, and `timestamp`.
