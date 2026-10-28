# CivicFix Environment Variables Specification
**Document Version:** 1.0.0  
**Phase:** Day 3: Development Environment Setup and Project Foundation  
**Status:** Approved Baseline  

---

## 1. Master Environment Variable Inventory

| Variable Name | Target Application | Visibility | Status (Day 3) | Status (Prod) | Purpose & Example Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PORT` | Backend API | **Server-Only** | Optional (5000) | Required | HTTP server listen port (e.g. `5000`) |
| `NODE_ENV` | Backend API | **Server-Only** | Optional (dev) | Required | Node runtime environment (`development`, `production`, `test`) |
| `FRONTEND_ALLOWED_ORIGINS` | Backend API | **Server-Only** | Optional (local) | Required | Comma-separated CORS origins (`http://localhost:5173,http://localhost:5174`) |
| `SUPABASE_URL` | Backend API | **Server-Only** | Optional (Day 4) | Required | Supabase REST URL (`https://xyzcompany.supabase.co`) |
| `SUPABASE_PUBLISHABLE_KEY` | Backend API | **Server-Only** | Optional (Day 4) | Required | Supabase client anon public key (`eyJh...`) |
| `SUPABASE_SECRET_KEY` | Backend API | **CRITICAL SECRET** | Optional (Day 4) | Required | Elevated `service_role` key (NEVER expose to client) |
| `LOG_LEVEL` | Backend API | **Server-Only** | Optional (info) | Optional (warn) | Logging verbosity (`debug`, `info`, `warn`, `error`) |
| `VITE_API_BASE_URL` | Staff & Admin Portals | **Public Client** | Optional (fallback) | Required | REST API Gateway endpoint (`http://localhost:5000/api/v1`) |
| `VITE_SUPABASE_URL` | Staff & Admin Portals | **Public Client** | Optional (Day 6) | Required | Client Supabase project endpoint |
| `VITE_SUPABASE_ANON_KEY` | Staff & Admin Portals | **Public Client** | Optional (Day 6) | Required | Client anonymous/publishable Supabase key |
| `API_BASE_URL` | Flutter Mobile | **Public Client** | Optional (fallback) | Required | Provided via `--dart-define` at compile time |

---

## 2. Security Boundaries & Secret Isolation Rules

1. **Vite Public Prefix Enforcement:**
   * Vite only bundles variables prefixed with `VITE_` into client JavaScript files.
   * **Absolute Prohibition:** `SUPABASE_SECRET_KEY` or any database credentials must **NEVER** use the `VITE_` prefix or be referenced inside `staff-portal/` or `admin-portal/`.
2. **Flutter Reverse-Engineering Protection:**
   * Compiled Flutter binaries and APK assets can be decompiled.
   * Mobile builds must **never** contain service-role keys or direct PostgreSQL connection strings.
   * All sensitive mutations and database access are mediated exclusively through the Node.js API Gateway.
3. **Git Leak Prevention:**
   * `.env` files are explicitly excluded via root `.gitignore`.
   * Only `.env.example` templates with generic placeholder values are committed to source control.
