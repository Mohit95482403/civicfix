# CivicFix Authentication Specification & Architecture

**Document Version:** 2.0.0  
**Phase:** Day 6 — Complete Authentication, Registration, Login, Profiles & Session Management  
**Status:** Approved & Implemented  

---

## 1. Authentication Philosophy

CivicFix establishes **Supabase Auth** as the cryptographically authoritative identity provider. The Node.js + Express backend functions as the secure API Gateway that enforces access token verification, validates profile associations, and executes role and organizational authorization.

```
┌────────────────────────────────────────────────────────┐
│ Client Apps (Flutter Mobile, React Staff, React Admin) │
└───────────────────────────┬────────────────────────────┘
                            │ 1. POST /api/auth/login or /api/auth/register
                            ▼
┌────────────────────────────────────────────────────────┐
│ CivicFix Express Backend API Gateway                   │
│  - Zod Request Validation (Strict no-role injection)   │
│  - Supabase Auth SDK (signUp / signInWithPassword)     │
│  - Profile Verification & Healing Trigger Fallback     │
└───────────────────────────┬────────────────────────────┘
                            │ 2. Issues AuthSession (JWT + Refresh Token)
                            ▼
┌────────────────────────────────────────────────────────┐
│ Client App (Stores Session Securely)                   │
└───────────────────────────┬────────────────────────────┘
                            │ 3. API Requests: Authorization: Bearer <JWT>
                            ▼
┌────────────────────────────────────────────────────────┐
│ CivicFix Express Protected Routes                      │
│  - requireAuth Middleware                              │
│  - Cryptographic Verification (supabase.auth.getUser)  │
│  - Server-Side Role Computation (Profiles + Memberships│
│  - Fail-Closed Policy                                  │
└───────────────────────────┬────────────────────────────┘
                            │ 4. Scoped PostgreSQL Query (RLS)
                            ▼
┌────────────────────────────────────────────────────────┐
│ Supabase PostgreSQL Database                           │
└────────────────────────────────────────────────────────┘
```

---

## 2. API Endpoints Parity (Unversioned & Versioned)

For seamless client integration, all authentication endpoints are available at both `/api/auth/*` and `/api/v1/auth/*`.

### A. Citizen Registration
* **Endpoint:** `POST /api/auth/register` (and `POST /api/v1/auth/register`)
* **Access:** Public
* **Rate Limit:** 5 requests / 15 minutes per IP
* **Request Schema:**
  ```json
  {
    "fullName": "Rahul Patil",
    "email": "rahul.patil@example.com",
    "password": "A-Strong-Example-Password!1",
    "phone": "+919876543210"
  }
  ```
* **Anti-Escalation Rule:** Rejects any request payload containing `role` or `userId` with HTTP 422 `VALIDATION_ERROR`.
* **Response (HTTP 201 Created):**
  ```json
  {
    "success": true,
    "message": "Registration successful. Please verify your email address to activate your account.",
    "data": {
      "user": {
        "id": "e4a2d3f0-4567-4890-abcd-1234567890ab",
        "email": "rahul.patil@example.com",
        "fullName": "Rahul Patil",
        "phone": "+919876543210",
        "role": "citizen",
        "emailVerified": false
      },
      "session": null,
      "emailVerificationRequired": true
    }
  }
  ```

### B. User Login
* **Endpoint:** `POST /api/auth/login` (and `POST /api/v1/auth/login`)
* **Access:** Public
* **Rate Limit:** 10 requests / 15 minutes per IP
* **Request Schema:**
  ```json
  {
    "email": "rahul.patil@example.com",
    "password": "A-Strong-Example-Password!1"
  }
  ```
* **Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "message": "Authentication successful.",
    "data": {
      "user": {
        "id": "e4a2d3f0-4567-4890-abcd-1234567890ab",
        "email": "rahul.patil@example.com",
        "fullName": "Rahul Patil",
        "role": "citizen",
        "emailVerified": true
      },
      "session": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "v1.MRhN-...",
        "expiresIn": 3600,
        "tokenType": "bearer"
      },
      "emailVerificationRequired": false
    }
  }
  ```

### C. Current Authenticated Identity
* **Endpoint:** `GET /api/auth/me` (and `GET /api/v1/auth/me`)
* **Access:** Authenticated (`Bearer <access-token>`)
* **Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "message": "User identity resolved successfully.",
    "data": {
      "user": {
        "id": "e4a2d3f0-4567-4890-abcd-1234567890ab",
        "email": "rahul.patil@example.com",
        "fullName": "Rahul Patil",
        "phone": "+919876543210",
        "role": "citizen",
        "emailVerified": true,
        "avatarPath": null
      },
      "memberships": []
    }
  }
  ```

### D. Logout
* **Endpoint:** `POST /api/auth/logout` (and `POST /api/v1/auth/logout`)
* **Access:** Authenticated (`Bearer <access-token>`)
* **Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "message": "Signed out successfully."
  }
  ```

### E. Password Recovery (Forgot Password)
* **Endpoint:** `POST /api/auth/forgot-password` (and `POST /api/v1/auth/forgot-password`)
* **Access:** Public
* **Anti-Enumeration Guarantee:** Returns a generic success message regardless of whether the email address exists in the database.
* **Request Schema:**
  ```json
  {
    "email": "rahul.patil@example.com"
  }
  ```
* **Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "message": "If an account exists with this email address, a password recovery link has been dispatched."
  }
  ```

### F. Password Reset Completion
* **Endpoint:** `POST /api/auth/reset-password` (and `POST /api/v1/auth/reset-password`)
* **Access:** Authenticated with Recovery Session Token
* **Request Schema:**
  ```json
  {
    "newPassword": "A-New-Secure-Password!9"
  }
  ```
* **Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "message": "Password updated successfully."
  }
  ```

### G. Session Refresh
* **Endpoint:** `POST /api/auth/refresh` (and `POST /api/v1/auth/refresh`)
* **Access:** Public (Requires valid Refresh Token)
* **Request Schema:**
  ```json
  {
    "refreshToken": "v1.MRhN-..."
  }
  ```
* **Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "message": "Session refreshed successfully.",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "v1.NEW-REFRESH-TOKEN...",
      "expiresIn": 3600,
      "tokenType": "bearer"
    }
  }
  ```

---

## 3. Session Refresh Ownership Across Application Clients

| Client Application | Storage Mechanism | Refresh Mechanism | Token Interception |
| :--- | :--- | :--- | :--- |
| **Flutter Citizen App** | Secure In-Memory & SecureStorage | Managed via `AuthService` on 401 | `Dio` Interceptor attaches Bearer token |
| **React Staff Portal** | `localStorage` (`civicfix_staff_token`) | Client-side via `POST /api/auth/refresh` | `apiClient` attaches Bearer token |
| **React Admin Portal** | `localStorage` (`civicfix_admin_token`) | Client-side via `POST /api/auth/refresh` | `apiClient` attaches Bearer token |

---

## 4. Token Invalidation Limitations & Reality

1. **Stateless JWT Lifetime:** A Supabase access token is a signed JWT with a default lifespan of 3600 seconds (1 hour). Once signed, the backend verifies the signature and expiration.
2. **Logout Scope:** Invoking `POST /api/auth/logout` revokes the session on Supabase Auth (preventing refresh token reuse) and prompts the client to purge local storage. If an active JWT is copied before logout, it remains valid until its cryptographic expiration timestamp expires, unless explicit Supabase JWT revocation tables are queried on every single request.
3. **Defense in Depth:** All state modifications are checked against PostgreSQL Row Level Security (RLS) policies and server-side profile active status (`is_active = true`).
