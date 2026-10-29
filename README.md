# CivicFix

> **Tagline:** *"Report It. Track It. Improve Your City."*

**CivicFix** is a modern, startup-level civic issue reporting and resolution tracking platform designed to bridge the transparency and accountability gap between citizens and municipal maintenance operations. Developed as an MCA final-year capstone, portfolio centerpiece, and potential real-world startup venture, CivicFix delivers an end-to-end digital pipeline for reporting infrastructure failures, dispatching field personnel, enforcing photographic proof of resolution, and capturing citizen feedback.

---

## 1. Project Identity & Purpose

* **Primary Objective:** Empower citizens to report neighborhood infrastructural problems (potholes, garbage dumps, broken streetlights, water pipeline leaks, drainage overflows) with photographic evidence and precise GPS coordinates, receive unique tracking reference codes, and monitor resolution progress in real time.
* **Operational Control:** Equip municipal staff, field technicians, and department supervisors with dedicated web portals to triage, assign, update, and resolve work orders with mandatory proof-of-work evidence.
* **Administrative Governance:** Provide municipal leaders with tools to manage departments, staff rosters, complaint categories, SLA compliance targets, and aggregate civic health analytics.
* **Pilot Boundary Notice:** Unless an authorized government integration or Memorandum of Understanding (MOU) is formally established, complaints are managed within the CivicFix ecosystem and are not automatically submitted to external government systems.

---

## 2. Fixed Technology Stack

| Tier / Application | Technology Selection | Architectural Role |
| :--- | :--- | :--- |
| **Unified Web Application**<br>(Citizen, Staff, Admin) | **React 19, Vite 6, Tailwind CSS 3.4, TypeScript 5**<br>• Centralized React Router 7<br>• Unified AuthProvider & Day 6 API Client<br>• Role-Guarded Scopes (`/citizen`, `/staff`, `/admin`, `/platform-admin`) | **One unified web application** consolidating all three user experiences with shared auth, common design system, and multi-tenant security. |
| **Citizen Mobile App** | **Flutter 3.x & Dart**<br>• Riverpod (State Management)<br>• GoRouter (Declarative Navigation) | Android-first mobile client sharing the same Node.js backend and Supabase database. |
| **Backend API Gateway** | **Node.js 20+ & Express.js**<br>• RESTful API Architecture<br>• Zod Request Validation<br>• Server-side RBAC & Tenant Scoping | Central application server enforcing business logic, complaint state machines, role authorization, and audit logging. |
| **Database & Auth** | **Supabase Managed PostgreSQL 15+**<br>• Supabase Auth (JWT Tokens)<br>• PostgreSQL Row Level Security (RLS)<br>• PostGIS Spatial Indexing | Relational database with foreign key integrity, multi-tenant isolation, and secure session management. |
| **Binary Storage** | **Supabase Storage** | S3-compatible cloud object storage with bucket-level policies for complaint photos and resolution evidence. |
| **Push Notifications** | **Firebase Cloud Messaging (FCM)** | Asynchronous push notifications delivering lifecycle updates to mobile devices. |
| **Mapping & Location** | **OpenStreetMap (OSM) / Google Maps** | Reverse-geocoding street addresses and interactive spatial pin drop. |
| **Testing & Quality** | **Vitest, React Testing, Jest** | 54 backend integration tests + 22 web-app tests with 100% passing rate. |

---

## 3. Unified Web Application Architecture

Rather than maintaining fragmented, duplicate React deployments for citizens, municipal staff, and administrators, CivicFix implements **ONE unified web application** located in `web-app/`.

### Directory Structure (`web-app/`)
```
web-app/
├── src/
│   ├── app/                    # Application roots (App.tsx, router.tsx)
│   ├── components/             # Reusable UI system (Button, Input, Card, StatCard, Badge, Modal, EmptyState)
│   ├── context/                # AuthContext & session management
│   ├── hooks/                  # Custom hooks (useAuth)
│   ├── layouts/                # Role layouts (PublicLayout, CitizenLayout, StaffLayout, AdminLayout)
│   ├── pages/                  # Experience modules
│   │   ├── public/             # Landing page with instant tracker, 404
│   │   ├── auth/               # Shared Login, Citizen Register, Forgot Password, Reset Password, Verify Email
│   │   ├── citizen/            # Citizen Dashboard, Complaints list, New Complaint wizard, Alerts, Profile
│   │   ├── staff/              # Staff Dashboard, Department Queue, Order Details, Assigned Tasks, Profile
│   │   ├── admin/              # Governance Dashboard, Triage Queue, Staff Provisioning, Departments, Categories, Reports, Audit Logs
│   │   └── platform-admin/     # Super-admin multi-tenant monitoring console
│   ├── routes/                 # Route guards (ProtectedRoute, RoleGuard)
│   ├── services/               # API clients (api.ts, auth.service.ts, complaints.service.ts, profile.service.ts)
│   ├── styles/                 # Tailwind design tokens & globals.css
│   ├── types/                  # TypeScript contracts (auth.ts, complaint.ts, api.ts)
│   ├── utils/                  # Formatters, storage utility with memory fallback
│   └── main.tsx                # React 19 entry point
├── package.json                # Dependencies & scripts
├── tailwind.config.js          # Master CivicFix design palette
└── vite.config.ts              # Port 3000 server configuration
```

### Role-Based Routing Scopes
* **Public:** `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`
* **Citizen (`citizen` role):** `/citizen/dashboard`, `/citizen/complaints`, `/citizen/complaints/new`, `/citizen/notifications`, `/citizen/profile`
* **Staff (`staff`, `department_supervisor` roles):** `/staff/dashboard`, `/staff/complaints`, `/staff/complaints/:id`, `/staff/assigned-complaints`, `/staff/profile`
* **Admin (`organization_admin`, `platform_admin` roles):** `/admin/dashboard`, `/admin/complaints`, `/admin/users`, `/admin/staff`, `/admin/departments`, `/admin/categories`, `/admin/reports`, `/admin/audit-logs`
* **Platform Super-Admin (`platform_admin` role):** `/platform-admin/dashboard`

---

## 4. Single Development Commands

```bash
# Start the unified web application (port 3000)
npm run dev:web
# or from root
npm run dev

# Start backend REST API (port 5000)
npm run dev:backend

# Run automated tests
npm --prefix web-app test         # 22 web-app tests passing
npm --prefix backend test         # 54 backend tests passing

# Production builds
npm run build:web                 # Vite production build (dist/)
npm run build:backend             # TypeScript build (dist/)
```

---

## 5. Current Milestone Status

* **Day 1–6:** Architecture, SRS, Design System, Database, Express API, Auth, and Profiles Complete.
* **Day 7:** **Unified Web Application (Citizen, Staff, and Admin Portals)** & Flutter Citizen Foundation Complete.
* **Next Milestone:** **Day 8: Complaint Submission Pipeline, Image Compression, Storage Upload & GPS Tagging**.
