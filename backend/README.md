# CivicFix Backend REST API Gateway

> **Phase:** Day 3 — Development Environment Setup & Project Foundation  
> **Tech Stack:** Node.js 20+, Express.js, TypeScript 5, Zod, Helmet, CORS

The backend API gateway is the central coordinator for business logic, status state machines, role-based access control (RBAC), and database mediation for CivicFix.

---

## 1. Directory Structure

```
backend/
├── src/
│   ├── config/             # Environment validation (env.ts) and external clients
│   ├── controllers/        # Future request handlers (Day 5 & 6)
│   ├── middleware/         # Error handler, 404 handler, request-id tracing
│   ├── routes/             # REST endpoints (health.routes.ts, versioned /api/v1)
│   ├── services/           # Future state machines and business logic
│   ├── types/              # TypeScript interfaces and type definitions
│   ├── utils/              # Structured logger and helpers
│   ├── validators/         # Zod request validation schemas
│   ├── app.ts              # Express application configuration
│   └── server.ts           # Server bootstrap and graceful shutdown
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
```

The server will listen on port **5000** by default.

---

## 3. Available Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `tsx watch src/server.ts` | Hot-reloading TypeScript development server |
| `npm run build` | `tsc` | Compiles TypeScript into `./dist` directory |
| `npm run start` | `node dist/server.js` | Runs production compiled JavaScript bundle |
| `npm run typecheck` | `tsc --noEmit` | Validates TypeScript types across the project |
| `npm run clean` | `rm -rf dist` | Removes build artifacts |

---

## 4. Health Check Endpoint

```http
GET /api/health
```

Sample Response:
```json
{
  "success": true,
  "service": "civicfix-api",
  "status": "healthy",
  "environment": "development",
  "uptimeSeconds": 14,
  "timestamp": "2026-10-28T15:30:00.000Z",
  "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```
