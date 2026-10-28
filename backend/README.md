# CivicFix Backend REST API Gateway

> **Phase:** Day 5 — Secure Backend Foundation, Supabase Auth & Authorization Middleware  
> **Tech Stack:** Node.js 20+, Express.js, TypeScript 5, Supabase Auth, Zod, Helmet, Vitest, Supertest

The backend API gateway is the central coordinator for business logic, status state machines, role-based access control (RBAC), multi-tenant organization isolation, and database mediation for CivicFix.

---

## 1. Directory Structure

```
backend/
├── src/
│   ├── config/             # Environment validation (env.ts), Supabase client layer (supabase.ts)
│   ├── controllers/        # Auth controllers (auth.controller.ts)
│   ├── middleware/         # requireAuth, optionalAuth, authorize, error-handler, not-found, request-id, rate-limit
│   ├── routes/             # REST endpoints (health.routes.ts, auth.routes.ts, index.ts)
│   ├── services/           # Authorization service (authorization.service.ts)
│   ├── types/              # Database types (database.types.ts), auth context (auth.types.ts, express.d.ts)
│   ├── utils/              # Standard ApiResponse, AppError hierarchy, structured logger
│   ├── validators/         # Zod schemas (common.validators.ts, auth.validators.ts)
│   ├── app.ts              # Express application pipeline & security middleware
│   └── server.ts           # Server bootstrap and graceful shutdown
├── tests/                  # Vitest automated test suite
│   ├── integration/        # Supertest integration tests (api.test.ts)
│   └── unit/               # Unit tests (authorization.test.ts, validation.test.ts)
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

# 4. Run automated unit & integration tests
npm test

# 5. Typecheck TypeScript
npm run typecheck
```

The server binds to port **5000** by default.

---

## 3. Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `tsx watch src/server.ts` | Hot-reloading TypeScript development server |
| `npm test` | `vitest run` | Executes all 30 unit & integration tests with Supertest |
| `npm run build` | `tsc` | Compiles TypeScript into `./dist` directory |
| `npm run start` | `node dist/server.js` | Runs production compiled JavaScript bundle |
| `npm run typecheck` | `tsc --noEmit` | Validates TypeScript types across the project |
| `npm run gen:types` | `npx supabase gen types ...` | Generates TypeScript types from Supabase database |
| `npm run clean` | `rm -rf dist` | Removes build artifacts |

---

## 4. Implemented API Endpoints (Day 5 Baseline)

| Method | Endpoint | Protection | Description |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/health` | Public | Liveness probe returning uptime, environment, and requestId. |
| `GET` | `/api/health/ready` | Public | Readiness probe checking Supabase database connectivity. |
| `POST` | `/api/v1/auth/register` | Rate-limited | Citizen signup via Supabase Auth with Zod body validation. |
| `POST` | `/api/v1/auth/login` | Rate-limited | Citizen/Staff login returning JWT access token. |
| `POST` | `/api/v1/auth/logout` | `requireAuth` | Terminates user session. |
| `GET` | `/api/v1/auth/me` | `requireAuth` | Returns verified user identity, profile, and staff memberships. |
| `GET` | `/api/v1/organizations/:orgId/verify-access` | `requireAuth` + Org Guard | Demonstrates multi-tenant organization boundary check. |
| `GET` | `/api/v1/admin/verify-platform-access` | `requireAuth` + Superuser | Demonstrates platform administrator superuser clearance. |
