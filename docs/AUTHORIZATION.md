# CivicFix Authorization Specification & Role Boundaries

**Document Version:** 2.0.0  
**Phase:** Day 6 — Complete Authentication, Registration, Login, Profiles & Session Management  
**Status:** Approved & Implemented  

---

## 1. Authentication vs. Authorization

* **Authentication ("Who are you?"):** Validates the cryptographic signature of the Supabase access token and verifies the user identity (`auth.uid()`).
* **Authorization ("What are you allowed to do?"):** Determines whether the verified identity holds permission to access, modify, or delegate a specific resource within an authorized jurisdiction.

> **Golden Rule:** A valid authentication token grants zero implicit privileges. Every privileged request is evaluated against trusted server-side database records. Requests sending `{ "role": "admin" }` or `{ "userId": "..." }` in the payload are rejected by strict Zod schema validation.

---

## 2. Five-Tier Role Hierarchy & Jurisdiction Model

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

### Role Matrix & Authorization Scopes

| Role | Organization Scope | Access Scope | Profile Updates | Provisioning Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | None (Public) | Own complaints + Public issues | Own name, phone, language | None (Public signup only) |
| **Staff** | Scoped to assigned `organization_id` | Assigned work orders & tasks | Own contact info | None |
| **Department Supervisor** | Scoped to assigned `organization_id` | All complaints in assigned department | Own contact info | Technicians within department |
| **Organization Admin** | Scoped to entire `organization_id` | All municipal complaints & departments | Own contact info | Staff, Supervisors, Departments |
| **Platform Admin**| Platform-wide | Unrestricted audit & oversight | Own contact info | Organizations, Platform Admins |

---

## 3. Administrative Staff Provisioning Endpoint

Staff and supervisors **cannot** register through the public registration endpoint (`POST /api/auth/register`). They must be provisioned by an authenticated Organization Administrator or Platform Administrator.

* **Endpoint:** `POST /api/v1/organizations/:orgId/staff/provision`
* **Authorization:** Guarded by `requireAuth` + `requireOrganizationRole(['ORG_ADMIN'])`
* **Request Schema:**
  ```json
  {
    "email": "technician.kumar@bbmp.gov.in",
    "fullName": "Ramesh Kumar",
    "role": "STAFF",
    "departmentId": "4a73752c-7b44-482a-9ad9-7b7da6155681",
    "phoneNumber": "+919876543210"
  }
  ```
* **Process Flow:**
  1. Verifies caller holds `ORG_ADMIN` privilege for the specified `:orgId`.
  2. Ensures caller cannot provision outside their assigned organization.
  3. Uses Supabase Admin Client (`auth.admin.createUser`) to provision credentials without exposing secrets to client.
  4. Automatically registers staff membership record in `staff_memberships`.
* **Response (HTTP 201 Created):**
  ```json
  {
    "success": true,
    "message": "Staff member provisioned successfully.",
    "data": {
      "user": {
        "id": "7b8f9e01-2345-6789-abcd-ef0123456789",
        "email": "technician.kumar@bbmp.gov.in",
        "fullName": "Ramesh Kumar"
      },
      "membership": {
        "id": "99aa88bb-1122-3344-5566-778899aabbcc",
        "organizationId": "00000000-0000-0000-0000-000000000001",
        "departmentId": "4a73752c-7b44-482a-9ad9-7b7da6155681",
        "role": "STAFF",
        "status": "active"
      }
    }
  }
  ```

---

## 4. Anti-Privilege Escalation Guarantees

1. **Strict Public Registration Guard:** Any client attempting to supply `"role": "platform_admin"` or `"role": "staff"` to `POST /api/auth/register` is rejected with HTTP 422 `VALIDATION_ERROR`.
2. **Strict Profile Tampering Guard:** Any client attempting to patch `"role"`, `"email"`, `"is_active"`, `"memberships"`, or `"id"` via `PATCH /api/profile` is rejected with HTTP 422 `VALIDATION_ERROR`.
3. **Multi-Tenant Isolation:** Users cannot access complaints or dispatch orders of other municipal corporations. Cross-tenant access is rejected with HTTP 403 `FORBIDDEN`.
4. **Portal Route Guards:**
   - React Staff Portal enforces `role in ['staff', 'department_supervisor', 'organization_admin']`. Citizens attempting to sign in receive HTTP 403 `Access Denied`.
   - React Admin Portal enforces `role in ['organization_admin', 'platform_admin']`. Field staff and citizens are rejected with `Administrative Access Prohibited`.
