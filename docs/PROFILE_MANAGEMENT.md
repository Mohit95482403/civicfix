# CivicFix Profile Management Specification

**Document Version:** 1.0.0  
**Phase:** Day 6 — Complete Authentication, Registration, Login, Profiles & Session Management  
**Status:** Approved Reference  

---

## 1. Database Schema & Identity Association

User profiles in CivicFix are modeled in PostgreSQL table `public.profiles`, linked in a strict 1:1 foreign key relationship with Supabase Auth (`auth.users.id`):

| Column | Type | Constraints | Modifiability | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `REFERENCES auth.users(id) ON DELETE CASCADE` | **IMMUTABLE** | Governed by verified token |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | **READ-ONLY via API** | Managed exclusively by Supabase Auth |
| `full_name` | `VARCHAR(255)` | `NOT NULL` | **EDITABLE** | Min 2, Max 100 characters |
| `phone_number` | `VARCHAR(30)` | Nullable | **EDITABLE** | Validated Indian phone format |
| `avatar_path` | `TEXT` | Nullable | **EDITABLE** | Supabase Storage path reference |
| `preferred_language`| `VARCHAR(10)` | Default `'en'` | **EDITABLE** | `'en'`, `'hi'`, `'kn'`, etc. |
| `is_active` | `BOOLEAN` | Default `true` | **IMMUTABLE by user** | Admin / Deactivation flag |
| `created_at` | `TIMESTAMPTZ` | Default `NOW()` | **IMMUTABLE** | System managed |
| `updated_at` | `TIMESTAMPTZ` | Default `NOW()` | **IMMUTABLE** | System managed |

---

## 2. API Endpoints Parity

Profile management is accessible at both `/api/profile` and `/api/v1/profile`.

### A. Retrieve Authenticated Profile
* **Endpoint:** `GET /api/profile` (and `GET /api/v1/profile`)
* **Headers:** `Authorization: Bearer <token>`
* **Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully.",
    "data": {
      "profile": {
        "id": "e4a2d3f0-4567-4890-abcd-1234567890ab",
        "email": "rahul.patil@example.com",
        "fullName": "Rahul Patil",
        "phoneNumber": "+919876543210",
        "avatarPath": null,
        "preferredLanguage": "en",
        "isActive": true,
        "createdAt": "2026-10-28T16:00:00.000Z",
        "updatedAt": "2026-10-28T16:00:00.000Z"
      },
      "role": "citizen",
      "memberships": []
    }
  }
  ```

### B. Update Permitted Profile Fields
* **Endpoint:** `PATCH /api/profile` (and `PATCH /api/v1/profile`)
* **Headers:** `Authorization: Bearer <token>`
* **Request Schema:**
  ```json
  {
    "fullName": "Rahul S. Patil",
    "phoneNumber": "+919876543211",
    "preferredLanguage": "kn"
  }
  ```
* **Validation & Security Guards:**
  - `validateRequest({ body: updateProfileBodySchema })` validates payload before processing.
  - Payloads containing any forbidden field (`role`, `email`, `is_active`, `id`, `memberships`) are rejected immediately with HTTP 422 `VALIDATION_ERROR`.
  - Empty update objects are rejected with HTTP 422.
* **Response (HTTP 200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully.",
    "data": {
      "profile": {
        "id": "e4a2d3f0-4567-4890-abcd-1234567890ab",
        "email": "rahul.patil@example.com",
        "fullName": "Rahul S. Patil",
        "phoneNumber": "+919876543211",
        "avatarPath": null,
        "preferredLanguage": "kn",
        "isActive": true,
        "createdAt": "2026-10-28T16:00:00.000Z",
        "updatedAt": "2026-10-28T16:45:00.000Z"
      }
    }
  }
  ```

---

## 3. Self-Healing Profile Recovery Architecture

In high-concurrency scenarios where a user completes OAuth or signup and the database trigger execution experiences temporary replication lag:
1. `ProfileService.getProfile` catches missing profile records.
2. It queries `auth.users` using the verified `userId`.
3. If the user exists in `auth.users`, it initializes a new `public.profiles` row with default values.
4. Logs the healing event with structured metadata (`action: 'PROFILE_SELF_HEALED'`).
5. Returns the newly initialized profile without failing the user request.
