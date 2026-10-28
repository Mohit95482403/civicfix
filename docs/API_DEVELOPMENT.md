# CivicFix Backend API Development Guide
**Document Version:** 1.0.0  
**Phase:** Day 3: Development Environment Setup and Project Foundation  
**Status:** Approved Baseline  

---

## 1. Quick Start & Local Server Execution

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file from template
copy .env.example .env

# 4. Run TypeScript development server with hot-reload
npm run dev
```

The server binds to `http://localhost:5000` by default.

---

## 2. API Route Architecture & Conventions

* **Root Health Route:** `GET /api/health`
* **Versioned Base Route:** `/api/v1/*`

All API endpoints strictly enforce standard JSON responses.

### Success Response Format
```json
{
  "success": true,
  "data": { ... },
  "requestId": "948e7105-4a12-4074-8424-f24f9548f03e",
  "timestamp": "2026-10-28T15:32:28.475Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title and description are required fields.",
    "details": [ ... ]
  },
  "requestId": "948e7105-4a12-4074-8424-f24f9548f03e",
  "timestamp": "2026-10-28T15:32:28.475Z"
}
```

---

## 3. Testing with cURL & Postman

### Testing Health Endpoint
```bash
curl -i http://localhost:5000/api/health
```

Expected Response (`200 OK`):
```json
{
  "success": true,
  "service": "civicfix-api",
  "status": "healthy",
  "environment": "development",
  "uptimeSeconds": 42,
  "timestamp": "2026-10-28T15:32:28.475Z",
  "requestId": "948e7105-4a12-4074-8424-f24f9548f03e"
}
```

### Testing 404 Route Catch-All
```bash
curl -i http://localhost:5000/api/v1/unknown
```

Expected Response (`404 Not Found`):
```json
{
  "success": false,
  "error": {
    "code": "ROUTE_NOT_FOUND",
    "message": "The requested endpoint GET /api/v1/unknown was not found on this server."
  },
  "requestId": "758b789e-e74c-4787-9efc-104895420366",
  "timestamp": "2026-10-28T15:32:28.512Z"
}
```

---

## 4. How to Add New Route Modules (Day 5+)

1. **Define Zod Validation Schema in `src/validators/`:**
   ```typescript
   export const createComplaintSchema = z.object({
     title: z.string().min(5).max(120),
     description: z.string().min(10),
     categoryId: z.string().uuid(),
     latitude: z.number().min(-90).max(90),
     longitude: z.number().min(-180).max(180),
   });
   ```

2. **Implement Request Controller in `src/controllers/`:**
   ```typescript
   export async function createComplaintHandler(req: Request, res: Response, next: NextFunction) {
     try {
       // Validate body, invoke service layer, return formatted response
     } catch (err) {
       next(err);
     }
   }
   ```

3. **Mount Route in `src/routes/` and Register in `src/routes/index.ts`:**
   ```typescript
   const router = Router();
   router.post('/', validate(createComplaintSchema), createComplaintHandler);
   apiV1Router.use('/complaints', router);
   ```
