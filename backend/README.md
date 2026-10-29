# CivicFix Backend REST API Gateway

> **Phase:** Day 6 — Complete Authentication, Registration, Login, Profiles & Session Management  
> **Tech Stack:** Node.js 20+, Express.js, TypeScript 5, Supabase Auth, Zod, Helmet, Vitest, Supertest  
> **Status:** 54/54 Automated Tests Passing  

The backend API gateway is the central coordinator for business logic, status state machines, role-based access control (RBAC), multi-tenant organization isolation, and database mediation for CivicFix.

---

## 1. Directory Structure

```
backend/
├── src/
│   ├── config/             # Environment validation (env.ts), Supabase client layer (supabase.ts)
│   ├── controllers/        # Auth (auth.controller.ts), Profile (profile.controller.ts)
│   ├── middleware/         # requireAuth, optionalAuth, authorize, error-handler, not-found, request-id, rate-limit
│   ├── routes/             # REST endpoints (health, auth, profile, index.ts)
│   ├── services/           # auth.service.ts, profile.service.ts, authorization.service.ts, staff-provisioning.service.ts
│   ├── types/              # Database types (database.types.ts), auth context (auth.types.ts, express.d.ts)
│   ├── utils/              # Standard ApiResponse, AppError hierarchy, structured logger
│   ├── validators/         # Zod schemas (common, auth, profile validators)
│   ├── app.ts              # Express application pipeline & security middleware
│   └── server.ts           # Server bootstrap and graceful shutdown
├── tests/                  # Vitest automated test suite (54 passing tests)
│   ├── integration/        # api.test.ts, auth-day6.test.ts
│   └── unit/               # authorization.test.ts, validation.test.ts, profile-validation.test.ts
├── dist/                   # Compiled production JavaScript (gitignored)
├── package.json            # Scripts and dependencies
├── tsconfig.json           # TypeScript configuration
├── .env.example            # Environment configuration template
└── README.md
```

---

## 2. Setup & Installation

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure environment variables
copy .env.example .env

# 3. Start local development server with hot-reload
npm run dev

# 4. Run automated unit & integration tests (54 passing tests)
npm test

# 5. Typecheck TypeScript
npm run typecheck

# 6. Build production bundle
npm run build
```

The server binds to port **5000** by default.

---

## 3. Implemented API Endpoints (Parity on `/api` and `/api/v1`)

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` / `/api/health` | Public | Healthcheck and uptime probe |
| `POST` | `/api/auth/register` | Public | Public citizen registration (strictly citizen role) |
| `POST` | `/api/auth/login` | Public | Supabase Auth login |
| `GET` | `/api/auth/me` | Authenticated | Current user identity, roles, and memberships |
| `POST` | `/api/auth/logout` | Authenticated | Session logout and token discard |
| `POST` | `/api/auth/forgot-password`| Public | Safe password recovery email dispatch |
| `POST` | `/api/auth/reset-password` | Authenticated | Password reset completion |
| `POST` | `/api/auth/refresh` | Public | Session token refresh |
| `GET` | `/api/profile` | Authenticated | Retrieve authenticated user profile |
| `PATCH`| `/api/profile` | Authenticated | Update permitted fields (`fullName`, `phoneNumber`, `preferredLanguage`) |
| `POST` | `/api/v1/organizations/:orgId/staff/provision` | Org Admin | Administrative staff & technician onboarding |
