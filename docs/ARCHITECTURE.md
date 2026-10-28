# System Architecture Specification
## Project: CivicFix — Civic Problem Reporting & Resolution Tracking Platform
**Document Version:** 1.0.0  
**Phase:** Day 1: Project Planning, Requirements Engineering & System Architecture  
**Status:** Approved Baseline  

---

## 1. High-Level Architecture Overview

CivicFix is designed as a modular, multi-tier, decoupled architecture. All client applications communicate with a centralized **Node.js / Express.js REST API gateway** for business operations, data persistence, and workflow transitions. The system leverages **Supabase** for managed PostgreSQL, authentication token issuance, and binary object storage, while maintaining zero client-to-database credential exposure.

### 1.1 Architecture Diagram

```
+─────────────────────────────────────────────────────────────────────────────────────────+
|                                    CLIENT APPLICATION TIER                              |
|                                                                                         |
|   +─────────────────────────+    +──────────────────────────+    +───────────────────+  |
|   |   Citizen Mobile App    |    |     Staff Web Portal     |    |  Admin Web Portal |  |
|   |    (Flutter / Dart)     |    |   (React / Vite / TW)    |    | (React / Vite/ TW)|  |
|   +────────────┬────────────+    +─────────────┬────────────+    +─────────┬─────────+  |
|                │                               │                           │            |
|                │  1. Authenticate with         │  1. Authenticate with     │            |
|                │     Supabase Auth SDK         │     Supabase Auth SDK     │            |
|                ▼                               ▼                           ▼            |
+────────────────┼───────────────────────────────┼───────────────────────────┼────────────+
                 │                               │                           │
                 │   [ Supabase Auth Service ] ──┴───────────────────────────┘
                 │   (Issues Signed RS256 / HS256 JWT Bearer Tokens)
                 │
                 │ 2. HTTPS REST Requests with Authorization: Bearer <JWT>
                 ▼
+─────────────────────────────────────────────────────────────────────────────────────────+
|                              CENTRAL BACKEND API SERVICE TIER                           |
|                              (Node.js / Express.js Application)                         |
|                                                                                         |
|   +─────────────────────────────────────────────────────────────────────────────────+   |
|   | Global Middlewares: Helmet, CORS, Rate-Limiting, JSON Body Parser               |   |
|   +────────────────────────────────────────┬────────────────────────────────────────+   |
|                                            ▼                                            |
|   +─────────────────────────────────────────────────────────────────────────────────+   |
|   | Auth & Tenant Middleware: Verify Supabase JWT, Extract Sub, Resolve Role & Org  |   |
|   +────────────────────────────────────────┬────────────────────────────────────────+   |
|                                            ▼                                            |
|   +─────────────────────────────────────────────────────────────────────────────────+   |
|   | RBAC Permission Guard: Check endpoint permissions against active role           |   |
|   +────────────────────────────────────────┬────────────────────────────────────────+   |
|                                            ▼                                            |
|   +─────────────────────────────────────────────────────────────────────────────────+   |
|   | Request Validation Layer: Schema validation via Zod (Payloads, Params, Queries) |   |
|   +────────────────────────────────────────┬────────────────────────────────────────+   |
|                                            ▼                                            |
|   +─────────────────────────────────────────────────────────────────────────────────+   |
|   | Business Logic & Workflow Engine:                                               |   |
|   |  - Complaint State Machine (10 statuses)                                        |   |
|   |  - Mandatory Evidence Verification                                              |   |
|   |  - Immutable Status History Recorder                                            |   |
|   |  - Internal Staff Notes Isolation                                               |   |
|   |  - Duplicate Proximity Detection                                                |   |
|   +───────────────────────┬───────────────────────────────┬─────────────────────────+   |
+───────────────────────────┼───────────────────────────────┼─────────────────────────────+
                            │                               │
                            │ Database Connection           │ Presigned Storage Tokens /
                            │ (Internal Pool)               │ Service Role API
                            ▼                               ▼
+─────────────────────────────────────────────────────────+ +─────────────────────────────+
|               MANAGED DATABASE TIER                     | |     STORAGE & 3RD PARTY     |
|               (Supabase PostgreSQL)                     | |         SERVICES            |
|                                                         | |                             |
|  - Relational Schema (14 Tables)                        | |  [ Supabase Storage ]       |
|  - Multi-tenant Organization Scoping                    | |   - complaints-media        |
|  - Foreign Key Constraints & Check Constraints          | |   - resolution-evidence     |
|  - PostgreSQL Row Level Security (RLS)                  | |                             |
|  - Spatial Coordinates & Distance Queries               | |  [ Firebase Cloud (FCM) ]   |
|  - Immutable Audit Logs & Status History                | |   - Push Notifications      |
|                                                         | |                             |
|                                                         | |  [ Maps API (OSM / Google)] |
|                                                         | |   - Tiles & Geocoding       |
+─────────────────────────────────────────────────────────+ +─────────────────────────────+
```

---

## 2. Component Responsibilities & Boundary Definitions

| Component | Technology | Primary Responsibilities | Strict Anti-Responsibilities (What it MUST NOT do) |
| :--- | :--- | :--- | :--- |
| **Citizen Mobile App** | Flutter 3.x / Dart / Riverpod / GoRouter | - User registration and login via Supabase Auth.<br>- Interactive camera capture and image compression.<br>- Geolocation capture and visual map pin drop.<br>- Ticket submission, progress tracking, and timeline viewing.<br>- Citizen feedback submission and reopening requests.<br>- FCM token registration and push notification handling. | - **NEVER** hold database connection strings or Supabase `service_role` keys.<br>- **NEVER** modify complaint status directly.<br>- **NEVER** access internal departmental staff notes.<br>- **NEVER** bypass Node.js API for complaint updates. |
| **Staff Web Portal** | React 18 / Vite / Tailwind CSS | - Secure authentication for field staff.<br>- View assigned complaints queue and filter by status.<br>- Update ticket status (`ASSIGNED` → `IN_PROGRESS`).<br>- Upload mandatory repair evidence photo & comments to resolve ticket.<br>- Add internal departmental progress notes.<br>- Launch map navigation to repair sites. | - **NEVER** self-register staff accounts (must be provisioned by admin).<br>- **NEVER** reassign tickets to other staff members outside permission.<br>- **NEVER** access complaints belonging to other departments/organizations. |
| **Supervisor & Admin Web Portal** | React 18 / Vite / Tailwind CSS | - Multi-level auth: Supervisors vs Org Admins vs Platform Admins.<br>- Complaint triage (`SUBMITTED` → `VERIFIED` or `REJECTED`).<br>- Work assignment and workload rebalancing.<br>- Department and category management (SLAs, priorities).<br>- Staff account provisioning and department association.<br>- Analytics dashboards, SLA breach tracking, and audit log inspection. | - **NEVER** expose backend secrets in client bundles.<br>- **NEVER** permit Org Admins to access other tenant organizations.<br>- **NEVER** permit Supervisors to modify platform configuration. |
| **Central Backend API** | Node.js 20+ / Express.js / REST | - Sole authority for business logic and state machine enforcement.<br>- Supabase Auth JWT validation and profile/role resolution.<br>- Enforce role-based and organization-scoped data access.<br>- Schema validation (Zod) on all incoming requests.<br>- Transactional execution of status changes and audit log writes.<br>- FCM push notification dispatching.<br>- Separation of citizen-facing comments from internal notes. | - **NEVER** allow unauthenticated access to sensitive business endpoints.<br>- **NEVER** trust client-supplied user roles or organization IDs from headers/bodies.<br>- **NEVER** log raw JWT tokens, passwords, or PII. |
| **Database Tier** | Supabase PostgreSQL 15+ | - Highly relational schema with foreign key integrity.<br>- Row Level Security (RLS) as a secondary defense layer.<br>- Geospatial data storage (latitude, longitude, spatial indexes).<br>- Transactional consistency and data durability. | - **NEVER** accept direct connections from public mobile or web clients without server mediation. |
| **Storage Service** | Supabase Storage | - Secure cloud storage for complaint photos and resolution evidence.<br>- Bucket-level access policies (public read for complaints, restricted for internal evidence). | - **NEVER** permit arbitrary, unauthenticated file writes without signed backend authorization. |
| **Notification Service**| Firebase Cloud Messaging (FCM) | - Dispatches asynchronous mobile push notifications on key state changes. | - Does not persist permanent business records (database records persist notifications). |
| **Mapping Service** | OpenStreetMap (OSM) / Leaflet / Google Maps | - Renders visual map tiles, reverse-geocodes coordinates into human-readable street addresses. | - Does not store complaint records. |

---

## 3. Network Topology & Secret Isolation Policy

```
[Flutter / React Clients]
          │
          │ Public Internet (TLS 1.3)
          │ Client possesses ONLY:
          │   - Public API Base URL
          │   - Supabase Project URL
          │   - Supabase Anon Public Key (anon-key)
          ▼
[Central Node.js API Gateway]
          │
          │ Secure Server-Side Network
          │ Server possesses:
          │   - Supabase Service Role Key (NEVER SHARED)
          │   - Supabase JWT Secret / Verification Key
          │   - PostgreSQL Direct Connection String (Internal Pool)
          │   - Firebase Admin SDK Service Account Credentials
          ▼
[Supabase Managed Infrastructure & FCM]
```

### Critical Security Rules:
1. **Anon Key vs. Service Role Key:** Frontends only hold the Supabase `anon` key, which has zero table permissions by default in our architecture. All database queries flow through the Node.js backend.
2. **Service Role Key Secrecy:** The Supabase `service_role` key is retained **strictly server-side** in Node.js environment variables (`.env`). It is never committed to Git and never bundled into frontend builds.
3. **No Direct SQL Connections:** Mobile and web clients do not have direct network access to PostgreSQL port 5432. All client traffic passes through HTTPS port 443 on the Express API.

---

## 4. End-to-End Data & Workflow Diagrams

### 4.1 Authentication & Session Verification Flow

```
[Client (Mobile / Web)]         [Supabase Auth Service]           [Node.js Backend API]            [PostgreSQL Database]
         │                                 │                                 │                              │
         ├── 1. POST /auth/v1/token ──────►│                                 │                              │
         │   (email + password)            │                                 │                              │
         │◄── 2. Returns JWT Access Token ─┤                                 │                              │
         │      + Refresh Token            │                                 │                              │
         │                                                                   │                              │
         ├── 3. GET /api/v1/complaints (Headers: Bearer <JWT>) ─────────────►│                              │
         │                                                                   ├── 4. Verify JWT Signature ───┤
         │                                                                   │   via Supabase Secret/Public │
         │                                                                   │                              │
         │                                                                   ├── 5. Query user profile, ────┼───────────►│
         │                                                                   │   role, organization_id      │            │
         │                                                                   │◄── 6. Return user metadata ──┼────────────┤
         │                                                                   │                              │
         │                                                                   ├── 7. Check RBAC permissions  │
         │                                                                   │   and filter by org_id       │
         │                                                                   │                              │
         │                                                                   ├── 8. Execute SQL Query ──────┼───────────►│
         │                                                                   │◄── 9. Return dataset ────────┼────────────┤
         │◄── 10. HTTP 200 OK (Enveloped JSON Data) ─────────────────────────┤                              │
```

---

### 4.2 Complaint Creation & Media Ingestion Flow

```
[Citizen Mobile App]                 [Node.js Backend API]             [Supabase Storage]          [PostgreSQL Database]
        │                                      │                                │                           │
        ├── 1. Capture photo & compress        │                                │                           │
        │      Fetch GPS coordinates           │                                │                           │
        │                                      │                                │                           │
        ├── 2. POST /api/v1/complaints/upload-url (Bearer <JWT>) ──────────────►│                           │
        │   (file_type: image/jpeg, size)      │                                │                           │
        │                                      ├── 3. Validate MIME & Size      │                           │
        │                                      ├── 4. Generate Presigned URL ──►│                           │
        │                                      │◄── 5. Presigned Upload URL ────┤                           │
        │◄── 6. Return Presigned Upload URL ───┤                                │                           │
        │                                                                       │                           │
        ├── 7. PUT binary payload directly to Presigned URL ───────────────────►│                           │
        │◄── 8. Upload Confirmation (HTTP 200) ─────────────────────────────────┤                           │
        │                                                                                                   │
        ├── 9. POST /api/v1/complaints (Bearer <JWT>) ─────────────────────────►│                           │
        │   { title, description, category_id,                                  ├── 10. Validate with Zod   │
        │     latitude, longitude, address,                                     ├── 11. Generate Tracking Ref│
        │     attachment_storage_path }                                         │    (CF-2026-BLR-001042)   │
        │                                                                       │                           │
        │                                                                       ├── 12. BEGIN TRANSACTION ──┼──────────►│
        │                                                                       │    - Insert complaint     │           │
        │                                                                       │    - Insert attachment    │           │
        │                                                                       │    - Insert status history│           │
        │                                                                       │    - Insert notification  │           │
        │                                                                       │    - COMMIT               │           │
        │                                                                       │◄── 13. Transaction Success ───────────┤
        │                                                                       │                           │
        │                                                                       ├── 14. Trigger FCM Push ──►[FCM Service]
        │◄── 15. HTTP 201 Created { complaint_id, tracking_reference } ─────────┤
```

---

### 4.3 Complaint Assignment & Reassignment Flow

```
[Supervisor / Admin Web]              [Node.js Backend API]                                    [PostgreSQL Database]
           │                                      │                                                      │
           ├── 1. POST /api/v1/complaints/:id/assign                                                     │
           │   { staff_id, estimated_resolution_time, notes }                                            │
           │                                      │                                                      │
           │                                      ├── 2. Verify User Role (Supervisor or Org Admin)      │
           │                                      ├── 3. Verify target staff belongs to same org & dept  │
           │                                      ├── 4. Verify complaint current status is VERIFIED     │
           │                                      │                                                      │
           │                                      ├── 5. BEGIN TRANSACTION ─────────────────────────────►│
           │                                      │    - Insert into complaint_assignments              │
           │                                      │    - Update complaints SET status = 'ASSIGNED'       │
           │                                      │    - Insert into complaint_status_history            │
           │                                      │    - Insert notification for assigned staff          │
           │                                      │    - Insert notification for citizen                 │
           │                                      │    - Insert into audit_logs                          │
           │                                      │    - COMMIT                                          │
           │                                      │◄── 6. Confirm Transaction ───────────────────────────┤
           │                                      │                                                      │
           │                                      ├── 7. Dispatch FCM Push to Staff & Citizen ──────────►[FCM Service]
           │◄── 8. HTTP 200 OK (Updated Complaint) ┘
```

---

### 4.4 Status Update & Resolution Flow with Mandatory Evidence

```
[Staff Mobile / Web]                  [Node.js Backend API]             [Supabase Storage]          [PostgreSQL Database]
        │                                      │                                │                           │
        ├── 1. Arrives on site                 │                                │                           │
        ├── 2. PATCH /api/v1/complaints/:id/status ────────────────────────────►│                           │
        │   { status: 'IN_PROGRESS', notes: 'Work begun' }                      ├── Update status & history┼──────────►│
        │◄── 3. HTTP 200 OK ───────────────────────────────────────────────────┤                           │
        │                                                                                                   │
        │   [ REPAIR COMPLETED ]                                                                            │
        ├── 4. Upload resolution proof photo to storage bucket ────────────────►│                           │
        │◄── 5. Storage Path Received ──────────────────────────────────────────┤                           │
        │                                                                                                   │
        ├── 6. POST /api/v1/complaints/:id/resolve ────────────────────────────►│                           │
        │   { evidence_storage_path, resolution_notes }                         ├── 7. Validate photo path  │
        │                                                                       │   exists and notes != ''  │
        │                                                                       ├── 8. BEGIN TRANSACTION ──┼──────────►│
        │                                                                       │   - Insert resolution_    │           │
        │                                                                       │     evidence record       │           │
        │                                                                       │   - Update complaint to   │           │
        │                                                                       │     status = 'RESOLVED'   │           │
        │                                                                       │   - Insert status_history │           │
        │                                                                       │   - Insert notification   │           │
        │                                                                       │     for citizen           │           │
        │                                                                       │   - COMMIT                │           │
        │                                                                       │◄── 9. Transaction OK ─────┤           │
        │                                                                       │                           │
        │                                                                       ├── 10. Dispatch FCM Push ─►[FCM Service]
        │◄── 11. HTTP 200 OK { status: 'RESOLVED', resolved_at } ───────────────┤
```

---

### 4.5 Citizen Feedback & Reopening Workflow

```
[Citizen Mobile App]                  [Node.js Backend API]                                    [PostgreSQL Database]
         │                                      │                                                      │
         ├──────────────────────────────────────┴──────────────────────────────────────────────────────┤
         │ Case A: Citizen Satisfied (Rating & Closing)                                                │
         ├── 1. POST /api/v1/complaints/:id/feedback                                                   │
         │   { rating: 5, feedback_text: 'Fixed quickly, excellent work!' }                            │
         │                                      ├── 2. Validate ticket is in RESOLVED status           │
         │                                      ├── 3. Insert into complaint_feedback ────────────────►│
         │                                      ├── 4. Update complaint status = 'CLOSED' ────────────►│
         │                                      ├── 5. Insert into complaint_status_history ──────────►│
         │◄── 6. HTTP 201 Created (Closed Ticket) ─────────────────────────────────────────────────────┤
         │                                                                                             │
         ├──────────────────────────────────────┴──────────────────────────────────────────────────────┤
         │ Case B: Citizen Disputes Resolution (Reopening within 48h)                                  │
         ├── 7. POST /api/v1/complaints/:id/reopen                                                     │
         │   { reason: 'Pothole was only partially filled; debris left behind.' }                      │
         │                                      ├── 8. Verify ticket is RESOLVED and resolved_at < 48h │
         │                                      ├── 9. BEGIN TRANSACTION ─────────────────────────────►│
         │                                      │    - Update complaint status = 'REOPENED'            │
         │                                      │    - Increment reopen_count in complaints            │
         │                                      │    - Insert into complaint_status_history            │
         │                                      │    - Insert alert notification for Supervisor        │
         │                                      │    - COMMIT                                          │
         │                                      │◄── 10. Confirm Transaction ──────────────────────────┤
         │                                      │                                                      │
         │                                      ├── 11. Dispatch Alert Push to Supervisor ────────────►[FCM Service]
         │◄── 12. HTTP 200 OK { status: 'REOPENED' } ──────────────────────────────────────────────────┘
```

---

## 5. Technology Stack Decisions & Trade-off Rationales

### 5.1 Citizen Mobile: Flutter & Dart
* **Decision:** Flutter cross-platform mobile framework with Riverpod and GoRouter.
* **Rationale:** A civic application must reach citizens on both Android and iOS devices. Flutter produces high-performance native ARM code with a single codebase, drastically cutting development time for the 20-day timeframe.
* **Riverpod:** Provides compile-safe, testable state management without Flutter context dependencies, ensuring reliable offline caching and reactive UI updates.
* **GoRouter:** Declarative, URL-driven routing simplifies deep-linking (e.g., tapping a push notification opens a specific complaint ID directly).

### 5.2 Staff & Admin Portals: React + Vite + Tailwind CSS
* **Decision:** React 18 with Vite build tool and Tailwind CSS utility styling.
* **Rationale:** Web portals require fast dashboard rendering, responsive tables, interactive mapping controls, and rapid UI development. Vite provides instant hot-module replacement (HMR) and optimized build bundles.
* **Tailwind CSS:** Enables rapid prototyping of responsive, highly accessible data tables, badge systems, and modals without bloated CSS stylesheets.

### 5.3 Backend Application Gateway: Node.js + Express.js REST API
* **Decision:** Central Node.js and Express REST API acting as the sole intermediary for all sensitive operations.
* **Rationale:**
  1. *Zero Direct DB Credentials:* Keeping database credentials and the Supabase `service_role` key strictly behind server-side Node.js prevents any reverse-engineering extraction from APKs or web bundles.
  2. *Strict State Machine Validation:* Business logic (e.g., verifying resolution evidence before setting status to `RESOLVED`, checking the 48-hour reopen window, duplicate checking) requires server-side computational control.
  3. *Audit & Logging:* Guarantees every single mutation generates an immutable audit record and triggers background notification dispatches.

### 5.4 Database & Backend Infrastructure: Supabase (PostgreSQL, Auth, Storage)
* **Decision:** Managed PostgreSQL on Supabase, leveraging Supabase Auth for identity management and Supabase Storage for media files.
* **Rationale:**
  1. *Relational Integrity:* Civic grievance tracking is inherently relational (Organizations → Departments → Staff → Complaints → Assignments → History → Evidence). Relational PostgreSQL with strict foreign keys prevents orphaned records.
  2. *Supabase Auth:* Handles cryptographic password hashing (bcrypt), JWT generation, token refresh cycles, and session revocation.
  3. *Supabase Storage:* Scalable S3-compatible object storage with presigned upload URLs, preventing the Node.js API server from becoming a bottleneck during large file uploads.
  4. *PostgreSQL Row Level Security (RLS):* Provides defense-in-depth at the database layer.

---

## 6. Deployment & Environment Strategy

| Environment | Host / Platform | Database | Secret Management | Target Branch |
| :--- | :--- | :--- | :--- | :--- |
| **Local Development** | Localhost (Node :5000, Vite :5173, Flutter Simulator) | Supabase Local CLI / Cloud Dev Project | Local `.env` files (ignored in `.gitignore`) | `feature/*` |
| **Staging / Test** | Render / Railway / Vercel | Supabase Managed Staging Instance | Cloud Provider Environment Variables | `develop` |
| **Production Pilot** | Dedicated Cloud VM or Managed PaaS | Supabase Managed Production (Postgres 15) | Encrypted Secrets Manager | `main` |
