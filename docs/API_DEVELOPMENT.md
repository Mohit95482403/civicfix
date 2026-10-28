# CivicFix Backend API Development Guide

**Document Version:** 2.0.0  
**Phase:** Day 5: Secure Node.js + Express + TypeScript Backend, Supabase Auth & Authorization Middleware  
**Status:** Approved & Implemented Baseline  

---

## 1. Quick Start & Local Server Execution

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file from template
copy .env.example .env

# 4. Run TypeScript development server with hot-reload (tsx watch)
npm run dev

# 5. Run automated test suite (Vitest + Supertest)
npm test

# 6. Typecheck TypeScript sources without emitting
npm run typecheck

# 7. Build production bundle to dist/
npm run build
```

The server binds to `http://localhost:5000` by default.

---

## 2. API Route Architecture & Conventions

* **Root Liveness Probe:** `GET /api/health`
* **Root Readiness Probe:** `GET /api/health/ready`
* **Versioned Base Route:** `/api/v1/*`
* **Auth Sub-router:** `/api/v1/auth/*`

All API endpoints strictly enforce standard JSON envelopes detailed in [docs/API_ERROR_CONVENTIONS.md](file:///c:/Users/NARENDRA/OneDrive/Desktop/civicfix/docs/API_ERROR_CONVENTIONS.md).

---

## 3. How to Protect a Route with Authentication & Authorization

### Step 1: Enforce Verified Supabase Auth Identity
To require a valid Supabase access token in the `Authorization: Bearer <token>` header:

```typescript
import { Router } from 'express';
import { requireAuth } from '../middleware/authenticate.js';

const router = Router();

// Only authenticated users can access
router.get('/profile', requireAuth, (req, res) => {
  // req.user contains { id, email, phone, appMetadata, userMetadata }
  // req.authContext contains { user, token, memberships, isPlatformAdmin }
});
```

### Step 2: Enforce Organization-Level Jurisdiction (Multi-Tenancy)
To prevent staff from Municipality A accessing records in Municipality B:

```typescript
import { requireOrganizationMembership } from '../middleware/authorize.js';

router.get(
  '/organizations/:orgId/complaints',
  requireAuth,
  requireOrganizationMembership('orgId'),
  (req, res) => {
    // Verified: user has active staff_memberships in orgId, or is Platform Admin
  }
);
```

### Step 3: Enforce Role Rank Hierarchy
To restrict an endpoint to Department Supervisors or Organization Administrators:

```typescript
import { requireOrganizationRole } from '../middleware/authorize.js';

router.post(
  '/organizations/:orgId/dispatch',
  requireAuth,
  requireOrganizationRole(['SUPERVISOR', 'ORG_ADMIN'], 'orgId'),
  (req, res) => {
    // Verified: user holds rank >= SUPERVISOR in orgId
  }
);
```

---

## 4. How to Add a New Route Module

1. **Define Request Validation Schema in `src/validators/`:**
   ```typescript
   import { z } from 'zod';

   export const createComplaintSchema = z.object({
     title: z.string().min(5).max(200),
     description: z.string().min(10),
     categoryId: z.string().uuid(),
     latitude: z.number().min(-90).max(90).optional(),
     longitude: z.number().min(-180).max(180).optional(),
   });
   ```

2. **Implement Controller in `src/controllers/`:**
   ```typescript
   import { Request, Response, NextFunction } from 'express';
   import { ApiResponse } from '../utils/api-response.js';
   import { createUserSupabaseClient } from '../config/supabase.js';

   export class ComplaintController {
     public static async create(req: Request, res: Response, next: NextFunction) {
       try {
         // Create client scoped to user's token so PostgreSQL RLS applies
         const client = createUserSupabaseClient(req.authContext!.token);
         const { data, error } = await client.from('complaints').insert({
           ...req.body,
           citizen_id: req.user!.id,
         }).select().single();

         if (error) throw error;
         return ApiResponse.created(res, data);
       } catch (err) {
         next(err);
       }
     }
   }
   ```

3. **Mount Route in `src/routes/` with Middleware Pipeline:**
   ```typescript
   import { Router } from 'express';
   import { requireAuth } from '../middleware/authenticate.js';
   import { validateRequest } from '../middleware/validate-request.js';
   import { createComplaintSchema } from '../validators/complaint.validators.js';
   import { ComplaintController } from '../controllers/complaint.controller.js';

   const router = Router();
   router.post('/', requireAuth, validateRequest({ body: createComplaintSchema }), ComplaintController.create);
   export const complaintRoutes = router;
   ```

---

## 5. Automated Testing Guidelines (Vitest + Supertest)

Write integration tests in `backend/tests/integration/`:

```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Example Route Test', () => {
  const app = createApp();

  it('rejects unauthenticated request with HTTP 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
```

Execute all tests with:
```bash
npm test
```
