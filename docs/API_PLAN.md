# REST API Architecture & Specification
## Project: CivicFix — Civic Problem Reporting & Resolution Tracking Platform
**Document Version:** 1.0.0  
**Phase:** Day 1: Project Planning, Requirements Engineering & System Architecture  
**Status:** Approved Baseline  
**Execution Note:** *This is an architectural API specification. Endpoint implementation will begin during the backend development phase.*

---

## 1. API Design Standards & Conventions

All endpoints adhere to RESTful best practices:
* **Base URL:** `/api/v1`
* **Transport Protocol:** HTTPS only (TLS 1.3 enforced)
* **Data Interchange:** `application/json` for requests and responses
* **Authentication:** HTTP Bearer token via `Authorization: Bearer <Supabase_JWT>` header

### 1.1 Standard Response Envelopes

#### Success Envelope (HTTP 200, 201)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "timestamp": "2026-10-28T20:30:00.000Z"
  }
}
```

#### Error Envelope (HTTP 400, 401, 403, 404, 409, 422, 500)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Mandatory resolution evidence photo is missing.",
    "details": [
      {
        "field": "evidence_storage_path",
        "issue": "Required string path missing."
      }
    ]
  },
  "timestamp": "2026-10-28T20:30:00.000Z"
}
```

---

## 2. Authentication & Profile Endpoints (`/api/v1/auth`)

---

### `POST /api/v1/auth/register`
* **Purpose:** Register a new Citizen account (Creates Supabase Auth user + public profile).
* **Authorized Roles:** Public (Unauthenticated)
* **Request Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "email": "priya.sharma@example.com",
    "password": "StrongPassword@123",
    "full_name": "Priya Sharma",
    "phone_number": "+919876543210"
  }
  ```
* **Validation Rules:**
  * `email`: Valid RFC 5322 format, max 255 chars.
  * `password`: Min 8 chars, at least 1 number, 1 uppercase, 1 special character.
  * `full_name`: Min 2, max 100 chars, no special script injections.
  * `phone_number`: Valid E.164 or Indian 10-digit mobile format.
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "user_id": "8f8b8e3a-4422-4871-85f6-6c8c4a45a1b3",
      "email": "priya.sharma@example.com",
      "full_name": "Priya Sharma",
      "primary_role": "CITIZEN",
      "access_token": "eyJhbGciOi...",
      "refresh_token": "dGhpcy1pcy..."
    }
  }
  ```
* **Error Responses:**
  * `400 Bad Request`: Validation failure.
  * `409 Conflict`: Email already registered.
  * `429 Too Many Requests`: Rate limit exceeded (Max 5 attempts / 15 mins).

---

### `POST /api/v1/auth/login`
* **Purpose:** Authenticate an existing user across any role.
* **Authorized Roles:** Public (Unauthenticated)
* **Request Body:**
  ```json
  {
    "email": "staff.ramesh@civicfix.org",
    "password": "StaffSecretPassword@456"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "user_id": "b3e34f8a-9821-49b1-b4f1-320d885a1190",
      "email": "staff.ramesh@civicfix.org",
      "full_name": "Ramesh Kumar",
      "primary_role": "STAFF",
      "organization_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "department_id": "c1d2e3f4-a5b6-7890-abcd-1234567890ab",
      "access_token": "eyJhbGciOi...",
      "refresh_token": "dGhpcy1pcy..."
    }
  }
  ```
* **Error Responses:**
  * `401 Unauthorized`: Invalid credentials.
  * `403 Forbidden`: Account deactivated or unverified.
  * `429 Too Many Requests`: IP rate-limited.

---

### `GET /api/v1/auth/me`
* **Purpose:** Retrieve the currently authenticated user's profile, role, and active organization context.
* **Authorized Roles:** All Authenticated (`CITIZEN`, `STAFF`, `SUPERVISOR`, `ORG_ADMIN`, `PLATFORM_ADMIN`)
* **Request Headers:** `Authorization: Bearer <JWT>`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "b3e34f8a-9821-49b1-b4f1-320d885a1190",
      "email": "staff.ramesh@civicfix.org",
      "full_name": "Ramesh Kumar",
      "phone_number": "+919811223344",
      "primary_role": "STAFF",
      "organization": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Bengaluru East Ward Pilot",
        "slug": "blr-east-pilot"
      },
      "department": {
        "id": "c1d2e3f4-a5b6-7890-abcd-1234567890ab",
        "name": "Roads & Infrastructure"
      }
    }
  }
  ```
* **Error Responses:**
  * `401 Unauthorized`: Token expired or malformed.
  * `404 Not Found`: Profile not found.

---

## 3. Complaint Ingestion & Retrieval Endpoints (`/api/v1/complaints`)

---

### `POST /api/v1/complaints/upload-url`
* **Purpose:** Generate a secure presigned upload URL for direct client-to-storage photo upload.
* **Authorized Roles:** `CITIZEN`, `STAFF`, `SUPERVISOR`, `ORG_ADMIN`
* **Request Body:**
  ```json
  {
    "bucket": "complaints-media",
    "file_type": "image/jpeg",
    "file_size": 2450000
  }
  ```
* **Validation Rules:**
  * `bucket`: Must be one of `['complaints-media', 'resolution-evidence']`.
  * `file_type`: Must be `image/jpeg` or `image/png`.
  * `file_size`: Max 5,242,880 bytes (5MB).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "upload_url": "https://xyz.supabase.co/storage/v1/object/upload/sign/complaints-media/org_1/temp_photo.jpg?token=...",
      "storage_path": "org_1/temp_photo.jpg",
      "expires_in_seconds": 300
    }
  }
  ```

---

### `POST /api/v1/complaints`
* **Purpose:** Create and submit a new civic complaint with photos, GPS, and categorization.
* **Authorized Roles:** `CITIZEN`
* **Request Body:**
  ```json
  {
    "organization_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "category_id": "f5e4d3c2-b1a0-9876-fedc-ba9876543210",
    "title": "Severe pothole causing vehicle skidding on 100ft Ring Road",
    "description": "Large 2-foot deep pothole near the bus stand junction. Water has collected inside.",
    "latitude": 12.971598,
    "longitude": 77.594566,
    "address_text": "Opposite Koramangala BDA Complex, 100ft Road, Bengaluru",
    "landmark": "Near bus stop #4",
    "attachments": [
      {
        "storage_path": "org_1/complaints/temp_uuid_1.jpg",
        "file_name": "pothole_angle1.jpg",
        "file_type": "image/jpeg",
        "file_size_bytes": 1854200
      }
    ]
  }
  ```
* **Validation Rules:**
  * `title`: 10 to 200 chars.
  * `description`: 20 to 2000 chars.
  * `latitude`: Between -90.0 and 90.0.
  * `longitude`: Between -180.0 and 180.0.
  * `attachments`: Array with 1 to 3 items. Mandatory minimum 1 photograph.
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7d9c8b7a-6e5f-4d3c-2b1a-0987654321fe",
      "tracking_reference": "CF-2026-BLR-001042",
      "status": "SUBMITTED",
      "created_at": "2026-10-28T20:30:00.000Z"
    }
  }
  ```
* **Error Responses:**
  * `400 Bad Request`: Payload validation error.
  * `401 Unauthorized`: Missing or invalid token.
  * `404 Not Found`: Category or organization ID invalid.

---

### `GET /api/v1/complaints`
* **Purpose:** List complaints with role-based filtering, status filtering, and pagination.
* **Authorized Roles:**
  * `CITIZEN`: Returns only complaints submitted by the requesting citizen.
  * `STAFF`: Returns complaints assigned to this staff member or unassigned in their department.
  * `SUPERVISOR`: Returns all complaints in their department.
  * `ORG_ADMIN`: Returns all complaints in their organization.
  * `PLATFORM_ADMIN`: Returns complaints across any organization.
* **Query Parameters:**
  * `status`: Optional filter (`SUBMITTED`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, etc.)
  * `department_id`: Optional filter.
  * `category_id`: Optional filter.
  * `page`: Integer (default 1).
  * `limit`: Integer (default 20, max 100).
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "7d9c8b7a-6e5f-4d3c-2b1a-0987654321fe",
        "tracking_reference": "CF-2026-BLR-001042",
        "title": "Severe pothole causing vehicle skidding on 100ft Ring Road",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "category_name": "Potholes and Damaged Roads",
        "created_at": "2026-10-28T10:15:00.000Z",
        "thumbnail_url": "https://xyz.supabase.co/..."
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 1 }
  }
  ```

---

### `GET /api/v1/complaints/:id`
* **Purpose:** Retrieve full details of a specific complaint including photos, assigned staff, and public comments.
* **Authorized Roles:**
  * `CITIZEN` (owner only or nearby public preview),
  * `STAFF` (assigned or departmental),
  * `SUPERVISOR`, `ORG_ADMIN`, `PLATFORM_ADMIN`.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "7d9c8b7a-6e5f-4d3c-2b1a-0987654321fe",
      "tracking_reference": "CF-2026-BLR-001042",
      "title": "Severe pothole causing vehicle skidding",
      "description": "Large 2-foot deep pothole near the bus stand junction.",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "latitude": 12.971598,
      "longitude": 77.594566,
      "address_text": "Opposite Koramangala BDA Complex, Bengaluru",
      "category": { "id": "...", "name": "Potholes and Damaged Roads" },
      "department": { "id": "...", "name": "Roads & Infrastructure" },
      "assigned_staff": { "id": "...", "full_name": "Ramesh Kumar" },
      "attachments": [
        { "id": "...", "storage_path": "...", "file_name": "pothole.jpg" }
      ],
      "sla_due_at": "2026-10-30T10:15:00.000Z",
      "created_at": "2026-10-28T10:15:00.000Z"
    }
  }
  ```
* **Error Responses:**
  * `403 Forbidden`: Unauthorized to view this ticket.
  * `404 Not Found`: Ticket not found.

---

### `GET /api/v1/complaints/nearby`
* **Purpose:** Search for complaints within a specified radius (e.g., 200m to 5km) to identify duplicates or local issues.
* **Authorized Roles:** All Authenticated Users
* **Query Parameters:**
  * `latitude`: Number (required, -90.0 to 90.0)
  * `longitude`: Number (required, -180.0 to 180.0)
  * `radius_meters`: Number (default 1000, max 5000)
  * `category_id`: Optional filter
* **Success Response (200 OK):** Array of compact complaint objects with `distance_meters`.

---

## 4. Complaint Workflow & Lifecycle Endpoints

---

### `POST /api/v1/complaints/:id/triage`
* **Purpose:** Supervisor reviews incoming `SUBMITTED` complaint and transitions to `VERIFIED` or `REJECTED`.
* **Authorized Roles:** `SUPERVISOR`, `ORG_ADMIN`
* **Request Body:**
  ```json
  {
    "action": "VERIFY",
    "department_id": "c1d2e3f4-a5b6-7890-abcd-1234567890ab",
    "priority": "HIGH",
    "remarks": "Verified as genuine road hazard."
  }
  ```
  *(If action is `REJECT`, `remarks` is mandatory and `department_id` is omitted).*
* **Validation Rules:**
  * Current status must be `SUBMITTED` or `UNDER_REVIEW`.
  * If `action == 'REJECT'`, `remarks` must be min 15 chars.
* **Success Response (200 OK):** Updated complaint object with status `VERIFIED` or `REJECTED`.

---

### `POST /api/v1/complaints/:id/assign`
* **Purpose:** Allocate a verified complaint to a designated field staff technician.
* **Authorized Roles:** `SUPERVISOR`, `ORG_ADMIN`
* **Request Body:**
  ```json
  {
    "staff_id": "b3e34f8a-9821-49b1-b4f1-320d885a1190",
    "assignment_notes": "Urgent repair. Bring asphalt patch mix.",
    "estimated_completion_hours": 24
  }
  ```
* **Validation Rules:**
  * Current complaint status must be `VERIFIED` or already `ASSIGNED` (for reassignment).
  * `staff_id` must belong to the department assigned to this complaint.
* **Success Response (200 OK):** Status updated to `ASSIGNED`.

---

### `PATCH /api/v1/complaints/:id/status`
* **Purpose:** Field staff updates work status (e.g., marks ticket `IN_PROGRESS`).
* **Authorized Roles:** Assigned `STAFF`, `SUPERVISOR`
* **Request Body:**
  ```json
  {
    "status": "IN_PROGRESS",
    "remarks": "Maintenance team has arrived on site with equipment."
  }
  ```
* **Validation Rules:** Current status must be `ASSIGNED`. Transitioning to `RESOLVED` via this endpoint is **prohibited** (must use `/resolve` endpoint).
* **Success Response (200 OK):** Status updated to `IN_PROGRESS`.

---

### `POST /api/v1/complaints/:id/resolve`
* **Purpose:** Mark ticket as resolved by submitting mandatory photographic proof and notes.
* **Authorized Roles:** Assigned `STAFF`, `SUPERVISOR`
* **Request Body:**
  ```json
  {
    "evidence_storage_path": "org_1/resolutions/comp_1042/repair_done.jpg",
    "file_name": "repair_done.jpg",
    "completion_notes": "Pothole filled with cold asphalt mix and roller compacted."
  }
  ```
* **Validation Rules:**
  * Current status must be `IN_PROGRESS`.
  * `evidence_storage_path`: Mandatory non-empty string pointing to valid uploaded file.
  * `completion_notes`: Minimum 10 characters.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "status": "RESOLVED",
      "resolved_at": "2026-10-28T20:30:00.000Z"
    }
  }
  ```
* **Error Responses:**
  * `422 Unprocessable Entity`: Evidence photograph missing.

---

### `POST /api/v1/complaints/:id/feedback`
* **Purpose:** Citizen rates resolution quality and submits satisfaction feedback (Transitions ticket to `CLOSED`).
* **Authorized Roles:** `CITIZEN` (Complaint Owner only)
* **Request Body:**
  ```json
  {
    "rating": 5,
    "feedback_text": "Excellent and prompt work by the road repair crew!",
    "is_satisfied": true
  }
  ```
* **Validation Rules:**
  * Complaint must currently be in `RESOLVED` status.
  * `rating`: Integer between 1 and 5.
* **Success Response (201 Created):** Ticket transitioned to `CLOSED`.

---

### `POST /api/v1/complaints/:id/reopen`
* **Purpose:** Citizen disputes resolution within 48-hour window if problem was not properly fixed.
* **Authorized Roles:** `CITIZEN` (Complaint Owner only)
* **Request Body:**
  ```json
  {
    "reason": "The pothole was only filled with loose stones. Rain washed it away within 4 hours."
  }
  ```
* **Validation Rules:**
  * Complaint must currently be in `RESOLVED` status.
  * Elapsed time since `resolved_at` must be **< 48 hours**.
  * `reason`: Minimum 15 characters.
* **Success Response (200 OK):** Ticket transitioned to `REOPENED`, alerting supervisor.

---

## 5. Administration & Operations Endpoints (`/api/v1/admin`)

---

### `GET /api/v1/admin/metrics`
* **Purpose:** Aggregate operational KPI metrics for the organization dashboard.
* **Authorized Roles:** `ORG_ADMIN`, `PLATFORM_ADMIN`, `SUPERVISOR` (Department-filtered)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "total_complaints": 482,
      "pending_triage": 14,
      "active_in_progress": 38,
      "resolved_this_week": 89,
      "sla_breach_count": 3,
      "average_turnaround_hours": 31.4,
      "citizen_satisfaction_rating": 4.6
    }
  }
  ```

---

### `POST /api/v1/admin/staff/provision`
* **Purpose:** Org Admin provisions a new staff account and assigns them to a department.
* **Authorized Roles:** `ORG_ADMIN`, `PLATFORM_ADMIN`
* **Request Body:**
  ```json
  {
    "email": "technician.rajesh@civicfix.org",
    "full_name": "Rajesh V",
    "phone_number": "+919876500000",
    "assigned_role": "STAFF",
    "department_id": "c1d2e3f4-a5b6-7890-abcd-1234567890ab",
    "initial_password": "TempPassword#2026"
  }
  ```
* **Validation Rules:**
  * Only Org Admin or Platform Admin can provision.
  * Target email must not exist in `profiles`.
* **Success Response (201 Created):** Profile and staff membership created.

---

### `GET /api/v1/admin/audit-logs`
* **Purpose:** Inspect immutable audit log records.
* **Authorized Roles:** `ORG_ADMIN`, `PLATFORM_ADMIN`
* **Query Parameters:** `page`, `limit`, `resource_type`, `from_date`, `to_date`
* **Success Response (200 OK):** List of audit events with actor, action, timestamp, and diffs.
