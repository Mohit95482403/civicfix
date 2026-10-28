# CivicFix REST API Response & Error Conventions

**Document Version:** 1.0.0  
**Phase:** Day 5 — Secure Backend Foundation, Supabase Auth & Authorization Middleware  
**Status:** Approved & Implemented Baseline  

---

## 1. Standard Success Response Format

All successful responses return JSON adhering to the following envelope:

```json
{
  "success": true,
  "data": { ... },
  "requestId": "9a5ed060-9191-4e9c-b920-c967b62df824",
  "timestamp": "2026-10-28T16:30:00.000Z"
}
```

* **`success` (boolean):** Always `true` for successful operations.
* **`data` (any):** The primary response payload (object or array).
* **`requestId` (string):** The unique UUID correlating client requests with server logs.
* **`timestamp` (string):** ISO 8601 UTC timestamp of response generation.

---

## 2. Standard Error Response Format

All error responses return JSON adhering to the following envelope:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": [
      {
        "field": "body.email",
        "message": "Must be a valid email address.",
        "code": "invalid_string"
      }
    ]
  },
  "requestId": "9a5ed060-9191-4e9c-b920-c967b62df824",
  "timestamp": "2026-10-28T16:30:00.000Z"
}
```

* **`success` (boolean):** Always `false` for failed operations.
* **`error.code` (string):** Machine-readable error code in uppercase snake_case (e.g., `UNAUTHORIZED`, `ROUTE_NOT_FOUND`, `VALIDATION_ERROR`).
* **`error.message` (string):** Human-readable, client-safe error description.
* **`error.details` (optional):** Structured validation errors or auxiliary non-sensitive context.
* **`requestId` (string):** Correlates with server error log entry for customer support and debugging.

---

## 3. Standard HTTP Status Code Conventions

| Status Code | Meaning | Standard Error Code | Usage Scenario |
| :---: | :--- | :--- | :--- |
| **200 OK** | Success | N/A | Successful GET, PUT, PATCH, or RPC operations. |
| **201 Created** | Created | N/A | Successful creation of complaints, comments, or registrations. |
| **204 No Content**| No Content | N/A | Successful deletion or state change returning no body. |
| **400 Bad Request**| Malformed Request | `BAD_REQUEST`, `MALFORMED_JSON` | Syntactically invalid payloads or business logic precondition failures. |
| **401 Unauthorized**| Authentication Required | `UNAUTHORIZED`, `INVALID_TOKEN` | Missing, malformed, or expired Bearer JWT token. |
| **403 Forbidden** | Authorization Denied | `FORBIDDEN` | Authenticated user lacks jurisdiction, role rank, or resource ownership. |
| **404 Not Found** | Resource Missing | `NOT_FOUND`, `ROUTE_NOT_FOUND` | URL route or requested database ID does not exist. |
| **409 Conflict** | Resource Conflict | `CONFLICT` | Duplicate complaint reference, duplicate feedback, or active assignment race. |
| **422 Unprocessable**| Validation Failed | `VALIDATION_ERROR` | Request payload fails Zod schema validation rules. |
| **429 Too Many Req** | Rate Limited | `RATE_LIMIT_EXCEEDED` | Client exceeded IP or user quota (e.g. login brute-force limit). |
| **500 Server Error** | Internal Server Error| `INTERNAL_SERVER_ERROR` | Unexpected unhandled server exception. Raw stack trace is withheld in production. |
| **503 Unavailable** | Service Unavailable | `SERVICE_UNAVAILABLE` | Downstream Supabase connectivity or readiness probe failure. |

---

## 4. Request ID Tracing

Every incoming request is assigned a UUID via [backend/src/middleware/request-id.ts](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/backend/src/middleware/request-id.ts):
- If the client supplies `X-Request-Id`, it is sanitized and reused.
- Otherwise, a fresh UUID v4 is generated.
- The ID is echoed in the `X-Request-Id` HTTP response header and embedded in the JSON body.
