# CivicFix Authentication Specification & Token Architecture

**Document Version:** 1.0.0  
**Phase:** Day 5 — Secure Backend Foundation, Supabase Auth & Authorization Middleware  
**Status:** Approved & Implemented Baseline  

---

## 1. Authentication Philosophy

CivicFix uses **Supabase Auth** as the single source of truth for user authentication. The Node.js + Express backend acts as the secure API Gateway that cryptographically verifies access tokens and enforces business rules.

```
┌─────────────────────────────────┐
│ Citizen Mobile / Web Portals    │
└────────────────┬────────────────┘
                 │ 1. Authenticate (Email/Password or OAuth)
                 ▼
┌─────────────────────────────────┐
│ Supabase Auth (Identity Server) │
└────────────────┬────────────────┘
                 │ 2. Issues Signed JWT Access Token
                 ▼
┌─────────────────────────────────┐
│ Client App (Stores Session)     │
└────────────────┬────────────────┘
                 │ 3. API Request: Authorization: Bearer <token>
                 ▼
┌─────────────────────────────────┐
│ CivicFix Express REST API       │
│  - requireAuth Middleware       │
│  - verifySupabaseToken()        │
│  - Attaches req.user & context  │
└────────────────┬────────────────┘
                 │ 4. Scoped Query with Bearer Token
                 ▼
┌─────────────────────────────────┐
│ PostgreSQL (RLS evaluates UID)  │
└─────────────────────────────────┘
```

---

## 2. Token Delivery & Extraction

* **Header Format:** All authenticated HTTP requests must include the token in the `Authorization` header using the `Bearer` scheme:
  ```http
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
* **Extraction Security:**
  * Implemented in [backend/src/middleware/authenticate.ts](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/backend/src/middleware/authenticate.ts).
  * Rejects missing, empty, or malformed headers with HTTP 401 `UNAUTHORIZED`.
  * **No Body Spoofing:** The backend strictly ignores client-supplied body fields such as `{ "userId": "...", "role": "admin" }`. Identity is derived solely from the cryptographically verified JWT.

---

## 3. Cryptographic Token Verification

1. **Verification Mechanism:** The backend invokes `supabase.auth.getUser(token)` via `@supabase/supabase-js`.
2. **Signature & Expiration Check:** Supabase Auth cryptographically validates the JWT signature, issuer, audience, and expiration timestamp.
3. **Invalid Token Rejection:** Expired, forged, revoked, or tampered tokens are rejected with HTTP 401:
   ```json
   {
     "success": false,
     "error": {
       "code": "UNAUTHORIZED",
       "message": "Invalid or expired authentication token."
     },
     "requestId": "7e366a20-b4f2-49d8-9993-94c6553ff8f3",
     "timestamp": "2026-10-28T16:25:00.000Z"
   }
   ```
4. **Log Redaction:** Tokens are scrubbed by `sanitizeMetadata()` in [backend/src/utils/logger.ts](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/backend/src/utils/logger.ts) and are never output to application logs.

---

## 4. Public Registration vs. Staff Provisioning

| Criterion | Citizen Public Registration | Municipal Staff & Official Provisioning |
| :--- | :--- | :--- |
| **Endpoint** | `POST /api/v1/auth/register` | Administrative Console or CLI Migration Seed |
| **Identity Creation**| Self-service via Supabase Auth signup | Administrative invitation or manual profile creation |
| **Role Assignment** | Implicit citizen role (`is_active = true`) | Explicit row created in `staff_memberships` table |
| **Database Trigger** | `trg_on_auth_user_created` creates base profile with safe defaults | Same trigger initializes profile; admin assigns department & role |
| **Privilege Escalation**| Public signup cannot assign staff roles or platform administrator status | Controlled strictly via `has_org_role('ORG_ADMIN')` or platform admin |

---

## 5. Logout & Session Management

1. **Client-Side:** The mobile app or web portal discards the stored access and refresh tokens from secure storage.
2. **Server-Side:** The `POST /api/v1/auth/logout` endpoint terminates the session and returns HTTP 200.
3. **Token Invalidation:** Because JWTs are stateless, Supabase Auth handles refresh token revocation on the identity server.

---

## 6. Implementation Status

* **Completed in Day 5:**
  - Token extraction and Bearer scheme parsing.
  - Integration with `@supabase/supabase-js` `getUser(token)`.
  - Reusable `requireAuth` and `optionalAuth` middleware.
  - Anti-spoofing unit and integration tests verifying body claims are rejected.
  - Route skeletons for `/api/v1/auth/register`, `/login`, `/logout`, and `/me`.
* **Scheduled for Day 6:**
  - End-to-end registration flow with email verification.
  - Password reset and email confirmation callbacks.
  - Refresh token rotation and session refresh endpoint.
