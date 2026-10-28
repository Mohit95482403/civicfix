# CivicFix Authorization Specification & Role Boundaries

**Document Version:** 1.0.0  
**Phase:** Day 5 — Secure Backend Foundation, Supabase Auth & Authorization Middleware  
**Status:** Approved & Implemented Baseline  

---

## 1. Authentication vs. Authorization

* **Authentication ("Who are you?"):** Validates the cryptographic signature of the Supabase access token and establishes user identity (`auth.uid()`).
* **Authorization ("What are you allowed to do?"):** Determines whether the verified identity holds permission to access, modify, or delegate a specific resource within an authorized jurisdiction.

> **Golden Rule:** A valid authentication token grants zero implicit privileges. Every privileged request is evaluated against trusted organizational membership records and explicit resource ownership rules.

---

## 2. Role Hierarchy & Jurisdiction Model

CivicFix models five distinct user archetypes:

```
[Platform Administrator] (Global Superuser - platform_administrators table)
         │
         ▼
[Organization Administrator] (ORG_ADMIN in staff_memberships)
         │
         ▼
[Department Supervisor] (SUPERVISOR in staff_memberships)
         │
         ▼
[Field Staff / Technician] (STAFF in staff_memberships)
         │
         ▼
[Citizen] (Public user with base profile in profiles table)
```

### Role Matrix & Permissions

| Role | Organization Scope | Complaint Access | Assignment Control | Internal Notes | System Config |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Citizen** | None (Public) | Own tickets + Public verified issues | None | **FORBIDDEN** | None |
| **Staff** | Scoped to assigned `organization_id` | Organization complaints in assigned department | Update assigned work order | View & Post | None |
| **Supervisor** | Scoped to assigned `organization_id` | All departmental complaints | Dispatch & reassign technicians | View & Post | Department queues |
| **Org Admin** | Scoped to entire `organization_id` | All municipal complaints | Full delegation authority | View & Post | Departments, Categories, SLAs |
| **Platform Admin**| Platform-wide | Unrestricted audit & oversight | Global override | View & Post | Organizations, Global templates |

---

## 3. Server-Side Authorization Middleware

Implemented in [backend/src/middleware/authorize.ts](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/backend/src/middleware/authorize.ts):

1. **`requireOrganizationMembership(paramKey)`:**
   - Extracts `organizationId` from route parameters (`:orgId`), body, or query.
   - Verifies the user has an active membership row in `staff_memberships`.
   - Rejects cross-tenant access attempts with HTTP 403 `FORBIDDEN`.
   - Platform administrators bypass single-tenant limits for administrative oversight.

2. **`requireOrganizationRole(allowedRoles, paramKey)`:**
   - Evaluates the role rank hierarchy:
     - `ORG_ADMIN` (rank 3) satisfies `SUPERVISOR` and `STAFF`.
     - `SUPERVISOR` (rank 2) satisfies `STAFF`.
     - `STAFF` (rank 1) satisfies `STAFF`.
   - Rejects insufficient rank with HTTP 403.

3. **`requirePlatformAdministrator()`:**
   - Checks the `platform_administrators` table.
   - Prevents regular organization administrators from invoking platform-wide actions.

---

## 4. Critical Resource-Level Security Guarantees

### 4.1 Internal Municipal Notes Shielding
Internal discussions, technician triage remarks, and administrative deliberations (`visibility = 'INTERNAL_ONLY'`) are strictly shielded from citizens.
- **Rule:** If `comment.visibility === 'INTERNAL_ONLY'`, the request is rejected unless `AuthorizationService.hasOrgMembership(...)` or `isPlatformAdmin` returns true.
- Citizen complaint owners can **only** query and receive `CITIZEN_VISIBLE` comments.

### 4.2 Multi-Tenant Jurisdiction Isolation
Staff belonging to Municipality A (e.g., Bengaluru East) are strictly blocked from inspecting complaints, staff rosters, or internal notes belonging to Municipality B (e.g., Pune Municipal Corporation).
- **Rule:** Parameter tampering (e.g., changing `?organizationId=...` in the request) triggers an immediate HTTP 403 `FORBIDDEN` error.

### 4.3 Anti-Privilege Escalation
- User roles are **never** stored in client-editable profile attributes.
- Profile registration initializes accounts as citizens.
- Staff membership assignment requires authenticated execution by an active `ORG_ADMIN` or platform superuser.
