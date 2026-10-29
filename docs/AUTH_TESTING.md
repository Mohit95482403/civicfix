# CivicFix Authentication & Authorization Testing Suite

**Document Version:** 1.0.0  
**Phase:** Day 6 — Complete Authentication, Registration, Login, Profiles & Session Management  
**Status:** 54/54 Automated Tests Passing  

---

## 1. Automated Test Architecture

CivicFix uses **Vitest** and **Supertest** to execute comprehensive unit and integration test suites against all authentication, authorization, and validation boundaries.

### Test Execution Command
```bash
cd backend
npm test
```

### Test Suite Summary
```
 Test Files  5 passed (5)
      Tests  54 passed (54)
   Duration  862ms
```

| Test File | Test Count | Focus Area |
| :--- | :--- | :--- |
| `tests/unit/validation.test.ts` | 10 | Request validation, schema constraints, input normalization |
| `tests/unit/authorization.test.ts` | 9 | Role resolution, organization boundaries, multi-tenant isolation |
| `tests/unit/profile-validation.test.ts` | 7 | Editable profile fields, strict rejection of forbidden keys (`role`, `email`, `is_active`) |
| `tests/integration/api.test.ts` | 11 | API Gateway routing, CORS headers, rate limiting, error responses |
| `tests/integration/auth-day6.test.ts` | 17 | Registration, login, `/me`, password recovery, token refresh, staff provisioning |

---

## 2. Automated Test Coverage Matrix

### A. Citizen Registration & Anti-Escalation
- [x] Valid citizen registration schema parses properly.
- [x] Registration rejects missing required fields (`fullName`, `email`, `password`) with HTTP 422.
- [x] Registration rejects malformed email addresses with HTTP 422.
- [x] Registration rejects weak passwords with HTTP 422.
- [x] **Privilege Escalation Protection:** Request containing `role: 'platform_admin'` is rejected with HTTP 422.
- [x] **Privilege Escalation Protection:** Request containing `role: 'staff'` is rejected with HTTP 422.
- [x] Version parity verified across `/api/auth/register` and `/api/v1/auth/register`.

### B. Login & Session Management
- [x] Login rejects empty payloads with HTTP 422.
- [x] Login rejects malformed email formats with HTTP 422.
- [x] Unauthenticated `/api/auth/me` returns HTTP 401.
- [x] Unauthenticated `/api/auth/logout` returns HTTP 401.
- [x] Token refresh rejects missing refresh tokens with HTTP 422.

### C. Profile Security & Anti-Tampering
- [x] Unauthenticated `/api/profile` returns HTTP 401.
- [x] Unauthenticated `/api/v1/profile` returns HTTP 401.
- [x] Unauthenticated `PATCH /api/profile` returns HTTP 401.
- [x] `PATCH /api/profile` permits valid updates (`fullName`, `phoneNumber`, `preferredLanguage`).
- [x] **Privilege Escalation Protection:** Client attempting to patch `role: 'organization_admin'` is rejected with HTTP 422.
- [x] **Privilege Escalation Protection:** Client attempting to patch `email: 'new@example.com'` is rejected with HTTP 422.
- [x] **Privilege Escalation Protection:** Client attempting to patch `is_active: false` is rejected with HTTP 422.
- [x] Empty update payload `{}` is rejected with HTTP 422.

### D. Password Recovery
- [x] Forgot password endpoint rejects malformed email addresses with HTTP 422.
- [x] Forgot password returns generic safe response to prevent email enumeration.
- [x] Reset password endpoint rejects unauthenticated caller with HTTP 401.

### E. Administrative Staff Provisioning
- [x] `POST /api/v1/organizations/:orgId/staff/provision` rejects unauthenticated callers with HTTP 401.
- [x] Non-admin callers attempting to provision staff receive HTTP 403 `FORBIDDEN`.

---

## 3. Manual Testing Procedure (cURL Workflows)

### 1. Citizen Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Rahul Patil",
    "email": "rahul.patil@example.com",
    "password": "SecurePassword123!",
    "phone": "+919876543210"
  }'
```

### 2. Privilege Escalation Prevention Verification
```bash
# This MUST fail with HTTP 422 VALIDATION_ERROR
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Hacker User",
    "email": "hacker@example.com",
    "password": "SecurePassword123!",
    "role": "platform_admin"
  }'
```

### 3. Citizen Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rahul.patil@example.com",
    "password": "SecurePassword123!"
  }'
```

### 4. Current User Session Retrieval
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### 5. Profile Tampering Prevention Verification
```bash
# This MUST fail with HTTP 422 VALIDATION_ERROR
curl -X PATCH http://localhost:5000/api/profile \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "organization_admin"
  }'
```

### 6. User Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```
