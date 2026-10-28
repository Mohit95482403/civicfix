# CivicFix Backend Security & Defense-in-Depth Specification

**Document Version:** 1.0.0  
**Phase:** Day 5 — Secure Backend Foundation, Supabase Auth & Authorization Middleware  
**Status:** Approved & Implemented Baseline  

---

## 1. Security Architecture Principles

CivicFix adheres to defense-in-depth principles across the entire API Gateway lifecycle:

```
[Incoming HTTP Request]
         │
         ▼
[1. Helmet Security Headers] (HSTS, CSP, X-Frame-Options, DNS Prefetch)
         │
         ▼
[2. Explicit CORS Allowlist] (Portals strictly bounded; credentials required)
         │
         ▼
[3. Request Size Limiting] (1MB max JSON payload to prevent memory exhaustion)
         │
         ▼
[4. Global / Auth Rate Limiting] (100 req/min general; 10 req/15min auth)
         │
         ▼
[5. Request ID & Tracing] (Audit logging without sensitive token leakage)
         │
         ▼
[6. Zod Request Validation] (Strict boundary validation; reject unexpected types)
         │
         ▼
[7. Supabase Auth Cryptographic Verification] (Validate signature, expiration)
         │
         ▼
[8. Role & Multi-Tenant Authorization Guards] (Verify org bounds & role rank)
         │
         ▼
[9. Scoped Database Client Execution] (PostgreSQL RLS applies automatically)
```

---

## 2. Secrets Management & Environment Isolation

* **Strict Non-Exposure:** The server secret key (`SUPABASE_SERVICE_ROLE_KEY`) is stored exclusively in `backend/.env`. It is **never** shared with frontend clients (Vite / Flutter) or bundled into client code.
* **Redaction in Logs:** Any logging statement passing through `logger.ts` automatically redacts keys containing `password`, `token`, `authorization`, `secret`, `key`, `credential`, or `apikey`.
* **Sanitized Diagnostics:** Configuration status can be inspected safely via `getSanitizedEnv()`, which masks active tokens with `[REDACTED]`.

---

## 3. CORS Configuration

Configured in [backend/src/app.ts](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/backend/src/app.ts):
- Allowed origins are read dynamically from `env.FRONTEND_ALLOWED_ORIGINS`:
  - `http://localhost:5173` (Staff Portal)
  - `http://localhost:5174` (Admin Portal)
  - `http://localhost:5175` (Design Prototype)
- Requests from unauthorized origins are rejected at the HTTP transport layer.
- Wildcards (`*`) are strictly prohibited in combination with credentialed requests (`credentials: true`).

---

## 4. Rate Limiting Strategy

Implemented in [backend/src/middleware/rate-limit.ts](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/backend/src/middleware/rate-limit.ts):
1. **API Rate Limiter:**
   - 100 requests per 60 seconds per IP address across all `/api` endpoints.
   - Prevents automated scrapers and Denial-of-Service attacks.
2. **Auth Rate Limiter:**
   - 10 attempts per 15 minutes across `/api/v1/auth/login` and `/api/v1/auth/register`.
   - Protects against brute-force credential stuffing and registration floods.
3. **Test Bypass:**
   - Automatically skipped when `NODE_ENV === 'test'` to permit high-speed CI execution without flaky rate-limit failures.

---

## 5. Dual Database Access Patterns

To maintain Row Level Security integrity without granting universal database superuser permissions:

### Pattern A: User-Scoped Access (Standard Practice)
- Created via `createUserSupabaseClient(accessToken)`.
- The user's verified Bearer JWT is passed to PostgreSQL on every query.
- PostgreSQL evaluates `auth.uid()` directly against the 14 Day 4 RLS policies.
- **Rule:** Use this pattern for all citizen requests, staff reads, and work order updates.

### Pattern B: Privileged Server-Side Access (Restricted)
- Created via `getAdminSupabaseClient()`.
- Uses `SUPABASE_SERVICE_ROLE_KEY`.
- Bypasses RLS completely.
- **Rule:** Restricted exclusively to automated background jobs (SLA breach escalation monitor, system push notification dispatch, and internal compliance logging). Handlers using this client must perform explicit procedural authorization checks first.
