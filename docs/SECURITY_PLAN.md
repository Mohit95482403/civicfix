# Security, Privacy & Compliance Architecture
## Project: CivicFix — Civic Problem Reporting & Resolution Tracking Platform
**Document Version:** 1.0.0  
**Phase:** Day 1: Project Planning, Requirements Engineering & System Architecture  
**Status:** Approved Baseline  

---

## 1. Security Philosophy & Defense-in-Depth

CivicFix adheres to the principle of **Defense-in-Depth**. Security is not delegated to a single tier; multiple independent layers of verification protect every asset, transaction, and piece of citizen data.

```
+─────────────────────────────────────────────────────────────+
| Layer 1: Network & Edge Security (TLS 1.3, CORS, Helmet)     |
+──────────────────────────────┬──────────────────────────────+
                               ▼
+─────────────────────────────────────────────────────────────+
| Layer 2: API Gateway Throttling (Rate Limiting, Slow Down)  |
+──────────────────────────────┬──────────────────────────────+
                               ▼
+─────────────────────────────────────────────────────────────+
| Layer 3: Identity & Token Validation (Supabase Auth JWT)    |
+──────────────────────────────┬──────────────────────────────+
                               ▼
+─────────────────────────────────────────────────────────────+
| Layer 4: Role-Based Authorization & Tenant Scoping (RBAC)   |
+──────────────────────────────┬──────────────────────────────+
                               ▼
+─────────────────────────────────────────────────────────────+
| Layer 5: Request Input Validation & Sanitization (Zod)      |
+──────────────────────────────┬──────────────────────────────+
                               ▼
+─────────────────────────────────────────────────────────────+
| Layer 6: Business State Machine Invariants (Workflow Guard) |
+──────────────────────────────┬──────────────────────────────+
                               ▼
+─────────────────────────────────────────────────────────────+
| Layer 7: Database Row Level Security (RLS) & Constraints    |
+──────────────────────────────┬──────────────────────────────+
                               ▼
+─────────────────────────────────────────────────────────────+
| Layer 8: Storage Access Policies & Presigned Expiry URLs    |
+─────────────────────────────────────────────────────────────+
```

---

## 2. Authentication & Token Lifecycle Architecture

1. **Authentication Provider:** Managed via Supabase Auth using industry-standard bcrypt password hashing and asymmetric/symmetric JWT token signatures.
2. **Token Structure:**
   * **Access Token:** Short-lived JSON Web Token (JWT) with 1-hour expiration containing user UUID (`sub`), email, and issuance timestamps.
   * **Refresh Token:** Long-lived cryptographically secure token stored in secure client storage (Flutter Secure Storage / HTTP-only Secure Cookies).
3. **Backend Token Verification:**
   * Node.js Express middleware intercepts every incoming request with `Authorization: Bearer <token>`.
   * The signature is cryptographically validated against the Supabase JWT secret or public keys.
   * Expired, tampered, or malformed tokens are immediately rejected with `HTTP 401 Unauthorized`.

---

## 3. Server-Side Authorization & Anti-Privilege Escalation

* **No Frontend Trust:** Client applications are considered completely untrusted execution environments. Role flags present in client storage or HTTP request payloads are completely ignored.
* **Authoritative Role Resolution:** Roles are retrieved directly from the PostgreSQL `profiles` and `staff_memberships` tables on the server side during authentication middleware processing.
* **Granular RBAC Guard:** Every Express route is wrapped in an explicit role guard:
  ```javascript
  router.post(
    '/complaints/:id/assign',
    authenticateUser,
    requireRole(['SUPERVISOR', 'ORG_ADMIN']),
    validate(assignComplaintSchema),
    assignComplaintHandler
  );
  ```

---

## 4. Multi-Tenant Data Isolation Strategy

CivicFix serves multiple municipal pilot organizations using a shared database with strict logical data isolation:
1. **Organization Scoping:** Every operational table (`departments`, `complaint_categories`, `complaints`, `audit_logs`) includes an indexed `organization_id` column.
2. **Backend Query Enforcement:** Every database query executed by the Node.js backend automatically binds the authenticated user's `organization_id`:
   ```sql
   SELECT * FROM complaints 
   WHERE organization_id = $1 AND id = $2;
   ```
3. **Cross-Tenant Attack Prevention:** An Organization Administrator from Organization A cannot view or alter records belonging to Organization B, even if they guess or acquire another complaint's UUID.

---

## 5. PostgreSQL Row Level Security (RLS) Strategy & Defense-in-Depth

> **CRITICAL ARCHITECTURAL WARNING:**  
> Enabling Row Level Security (RLS) in PostgreSQL is **not a silver bullet** and does not automatically secure every access vector. Misconfigured policies, database superuser connections, or careless backend usage of the `service_role` key can completely bypass RLS.

### 5.1 RLS Implementation Strategy
1. **RLS as Secondary Defense:** In CivicFix, the primary authorization barrier is the **Node.js Express API layer**. RLS acts as a secondary defense layer preventing unauthorized data leaks in the event of backend query mistakes or direct Supabase API access.
2. **Service Role Key Usage Policy:**
   * The Supabase `service_role` key bypasses RLS by design.
   * In CivicFix, the `service_role` key is **strictly confined to backend server environment variables**. It is **NEVER** exposed to client apps.
   * The backend uses standard scoped queries for all everyday citizen and staff requests, reserving elevated keys only for system-level administrative tasks (such as background cleanup crons or provisioning).
3. **Baseline RLS Policies:**
   * `profiles`: Users can read public profiles; can only update their own non-role profile attributes (`auth.uid() = id`).
   * `complaints`: Citizens can read their own complaints or public complaints in their locality; can only insert complaints with `citizen_id = auth.uid()`.
   * `complaint_comments`: Non-internal comments are readable by complaint owners; internal comments are readable only by users with staff memberships.

---

## 6. Secure Storage Architecture & File Upload Pipeline

1. **Direct-to-Storage Presigned Uploads:**
   * Clients do not stream large binary images through the Node.js API server, preventing thread starvation and memory bloat.
   * Clients request a presigned upload URL from `POST /api/v1/complaints/upload-url`.
   * The backend validates the requested MIME type (`image/jpeg`, `image/png`) and file size (max 5MB) before issuing a temporary URL expiring in 300 seconds.
2. **Bucket-Level Isolation:**
   * `complaints-media`: Stores initial citizen photos. Publicly readable via CDN.
   * `resolution-evidence`: Stores staff remediation photos. Restricted access via signed URLs to ensure evidentiary authenticity.
3. **Path Traversal & Filename Defense:**
   * Client-supplied filenames (e.g. `../../etc/passwd` or `malicious.exe`) are completely discarded.
   * Storage paths are generated server-side using secure UUIDs: `org_{org_id}/complaints/{uuid}.jpg`.

---

## 7. Input Validation, Sanitization & Injection Defense

1. **Schema Validation with Zod:** Every request body, URL path parameter, and query string is parsed and validated against strict Zod schemas before reaching business controllers. Unrecognized fields are automatically stripped.
2. **SQL Injection Defense:** CivicFix strictly uses parameterized SQL queries ($1, $2, ...) and the Supabase PostgREST query builder. Raw string concatenation in SQL queries is categorically banned.
3. **Cross-Site Scripting (XSS) Sanitization:** Citizen descriptions, titles, and comment strings are HTML-entity encoded and sanitized before rendering on web portals.

---

## 8. API Security, Throttling & Header Hardening

1. **Rate Limiting:**
   * Global API limiter: Max 100 requests per minute per IP address.
   * Auth endpoints (`/auth/login`, `/auth/register`): Max 5 attempts per 15 minutes per IP to block credential stuffing and brute-force attacks.
   * Upload URL generator: Max 10 requests per 10 minutes per authenticated user.
2. **HTTP Header Hardening (Helmet):**
   * Enforce `Strict-Transport-Security` (HSTS) with 1-year max-age.
   * Set `X-Content-Type-Options: nosniff`.
   * Set `X-Frame-Options: DENY` to prevent clickjacking.
   * Set strict `Content-Security-Policy` (CSP) on web portals.
3. **CORS Whitelisting:** Express CORS middleware restricts API consumption exclusively to authorized client origins (Mobile app schemes and portal domains `staff.civicfix.org`, `admin.civicfix.org`).

---

## 9. Privacy, PII Protection & Legal Compliance (India DPDP Act 2023)

As a civic reporting platform handling citizen locations and identities, CivicFix is architected to comply with India's **Digital Personal Data Protection Act, 2023 (DPDP Act)**:

1. **Purpose Limitation & Data Minimization:** The platform collects only data strictly necessary for civic remediation (name, contact phone, complaint photo, GPS coordinates).
2. **Citizen Contact Masking:** Field staff and maintenance contractors see only the complaint description, photos, and geographical address. Citizen mobile numbers and email addresses are masked in staff views to prevent contractor harassment or spam.
3. **Clear Consent Notice:** Citizen registration and complaint submission include explicit consent checkboxes outlining how photos and coordinates will be used to dispatch repairs.
4. **Right to Erasure & Account Deletion:** Citizens can request account deletion. In accordance with municipal audit requirements:
   * Citizen PII (name, phone, email) is anonymized / scrubbed from the `profiles` table.
   * Historical complaint records, status histories, and repair photos are retained with an anonymized `citizen_id` to preserve public infrastructure records.
5. **Grievance Redressal Contact:** Terms of service provide a designated email channel for data privacy inquiries and grievance escalation.

---

## 10. Audit Logging, Safe Logging & Error Sanitization

1. **Safe Logging Standards:**
   * Winston / Pino application loggers are configured with strict redactors.
   * **NEVER LOGGED:** Passwords, JWT tokens, refresh tokens, credit card data, raw citizen phone numbers, or national IDs.
2. **Sanitized Error Responses:**
   * Production error handlers return generic error messages (e.g., `INTERNAL_SERVER_ERROR`).
   * Database error stacks, SQL query traces, and internal file paths are written to secure internal server logs and are never transmitted in HTTP responses.
3. **Immutable Audit Trail:** All administrative mutations (staff creation, category updates, ticket overrides) write to `audit_logs` capturing actor, action, timestamp, IP, and payload diffs.

---

## 11. Backup, Disaster Recovery & High Availability

1. **Automated Database Snapshots:** Supabase automated daily backups retained for 7 days in staging and 30 days in production.
2. **Point-in-Time Recovery (PITR):** Production database tier configured with WAL archiving enabling recovery to any specific minute in the preceding 7 days in case of accidental data truncation.
3. **Storage Redundancy:** S3-compatible Supabase Storage configured with multi-AZ geographic redundancy.
