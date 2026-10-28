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
| **Citizen Mobile App** | **Flutter 3.x & Dart**<br>• Riverpod (State Management)<br>• GoRouter (Declarative Navigation) | High-performance cross-platform mobile application (Android/iOS) for camera capture, GPS tagging, tracking, feedback, and push alerts. |
| **Staff Web Portal** | **React 18, Vite, Tailwind CSS** | Mobile-responsive web portal for field technicians to view assigned tickets, update statuses, add progress notes, and upload repair evidence. |
| **Admin Web Portal** | **React 18, Vite, Tailwind CSS** | Desktop-optimized management dashboard for triage, staff assignment, department/category configuration, and audit log inspection. |
| **Backend API Gateway** | **Node.js 20+ & Express.js**<br>• RESTful API Architecture<br>• Zod Request Validation<br>• Server-side RBAC & Tenant Scoping | Central application server enforcing business logic, complaint state machines, role authorization, and audit logging. |
| **Database & Auth** | **Supabase Managed PostgreSQL 15+**<br>• Supabase Auth (JWT Tokens)<br>• PostgreSQL Row Level Security (RLS)<br>• PostGIS Spatial Indexing | Relational database with foreign key integrity, multi-tenant isolation, and secure session management. |
| **Binary Storage** | **Supabase Storage** | S3-compatible cloud object storage with bucket-level policies for complaint photos and resolution evidence. |
| **Push Notifications** | **Firebase Cloud Messaging (FCM)** | Asynchronous push notifications delivering lifecycle updates to mobile devices. |
| **Mapping & Location** | **OpenStreetMap (OSM) / Google Maps** | Reverse-geocoding street addresses and interactive spatial pin drop. |
| **Testing & Quality** | **Git / GitHub, Postman, Jest** | Version control, API regression testing suites, and CI/CD pipelines. |

> **Architectural Guarantee:** Mobile and web clients **never** connect directly to PostgreSQL using database credentials. All database operations are mediated by the Node.js backend. Supabase `service_role` keys are strictly isolated server-side.

---

## 3. Planned Applications & Repository Structure

```
civicfix/
├── mobile/                     # Flutter citizen mobile application
│   ├── lib/
│   │   ├── features/           # Feature-based modular architecture (auth, complaints, tracking)
│   │   ├── core/               # Routing (GoRouter), theme, network client, providers (Riverpod)
│   │   └── main.dart
│   └── pubspec.yaml
├── staff-portal/               # React + Vite field technician web portal
│   ├── src/
│   │   ├── components/         # Ticket cards, camera upload modal, status badges
│   │   ├── pages/              # Assigned queue, detail view, evidence submit
│   │   └── api/                # Axios/Fetch client connecting to Node backend
│   └── package.json
├── admin-portal/               # React + Vite administrative management dashboard
│   ├── src/
│   │   ├── pages/              # Triage queue, staff management, departments, categories, audit logs
│   │   └── components/         # Data tables, SLA analytics charts, assignment modals
│   └── package.json
├── backend/                    # Node.js + Express REST API gateway
│   ├── src/
│   │   ├── controllers/        # Request handlers (auth, complaints, workflow, admin)
│   │   ├── middleware/         # Auth JWT, RBAC guards, rate-limiting, error handler
│   │   ├── routes/             # REST route definitions (/api/v1/*)
│   │   ├── services/           # State machine, storage helper, FCM dispatcher
│   │   └── utils/              # Zod validation schemas, custom error classes
│   └── package.json
├── database/                   # Database migrations and seed datasets
│   ├── migrations/             # Incremental PostgreSQL DDL scripts (Day 4 execution)
│   └── seeds/                  # Initial organizations, categories, and test profiles
├── docs/                       # Architectural & engineering specifications
│   ├── SRS.md                  # Software Requirements Specification
│   ├── ARCHITECTURE.md         # System Architecture & Flow Diagrams
│   ├── DATABASE_PLAN.md        # Database Blueprint, 14 Tables, RLS & Storage Plan
│   ├── API_PLAN.md             # REST API Endpoint Inventory & Request/Response Contracts
│   ├── USER_ROLES.md           # 5 User Roles, CRUD Matrix & Anti-Privilege Escalation
│   └── SECURITY_PLAN.md        # Defense-in-Depth, DPDP Act Compliance & Security Policies
├── tests/                      # API integration tests and validation suites
├── .gitignore                  # Git ignore rules for Flutter, Node, React, and environment secrets
└── README.md                   # Project overview, roadmap, and status guide
```

---

## 4. Twenty-Day Development Roadmap

| Day | Milestone Focus | Deliverables & Scope | Status |
| :-: | :--- | :--- | :-: |
| **Day 1** | **Project Requirements & Architecture** | Complete SRS, Architecture, Database Plan, API Plan, Roles, Security Plan, and Repository Structure. | **COMPLETED** |
| **Day 2** | **UI/UX Design & Design System** | Wireframes, component specifications, color palettes, mobile and web design tokens. | Upcoming |
| **Day 3** | **Project Setup & Environment Tooling** | Workspace initialization, Flutter project creation, React Vite setups, Node/Express scaffolding, ESLint, Git hooks. | Upcoming |
| **Day 4** | **Supabase Project & PostgreSQL Schema** | Supabase project creation, 14-table schema migration execution, constraints, indexes, and initial category seeds. | Upcoming |
| **Day 5** | **Backend Foundation & Database Security** | Express API scaffolding, Supabase client initialization, RLS policies, error middleware, and health endpoints. | Upcoming |
| **Day 6** | **Authentication & Authorization** | Supabase Auth integration, JWT verification middleware, RBAC guards, citizen register/login, staff provisioning. | Upcoming |
| **Day 7** | **Flutter Foundation & Citizen App Shell** | Riverpod state foundation, GoRouter navigation, design system implementation, auth screen flows. | Upcoming |
| **Day 8** | **Complaint Submission Pipeline** | Mobile complaint wizard, camera photo capture, image compression, presigned storage upload, GPS tagging. | Upcoming |
| **Day 9** | **Complaint Tracking & Citizen History** | Mobile ticket timeline, status history visualizer, tracking reference search, public comment thread. | Upcoming |
| **Day 10** | **Maps & Geospatial Discovery** | Interactive map integration, pin dropping, address reverse-geocoding, nearby duplicate complaint discovery. | Upcoming |
| **Day 11** | **Staff Web Portal Foundation** | React + Vite setup, responsive layout, authentication, assigned ticket queue, search and filtering. | Upcoming |
| **Day 12** | **Complaint Resolution Workflow** | Staff detail view, status update (`IN_PROGRESS`), mandatory photographic evidence upload, `/resolve` endpoint. | Upcoming |
| **Day 13** | **Admin Web Portal Foundation** | Administrative dashboard layout, department management, dynamic category/SLA management. | Upcoming |
| **Day 14** | **Assignment & Workflow Controls** | Triage queue, staff assignment/reassignment modals, duplicate merging, citizen feedback and reopening handling. | Upcoming |
| **Day 15** | **Notifications & Alerts** | In-app notification system, Firebase Cloud Messaging (FCM) integration for mobile push alerts on status transitions. | Upcoming |
| **Day 16** | **Analytics & Operational Reporting** | Municipal KPI dashboard, SLA breach tracking, category volume charts, CSV/PDF report export. | Upcoming |
| **Day 17** | **UI/UX Polish & Accessibility** | Responsive layout fixes, loading skeletons, empty states, micro-animations, form error polish. | Upcoming |
| **Day 18** | **Testing & Bug Fixing** | End-to-end workflow verification, Postman collection execution, security boundary audits, bug remediation. | Upcoming |
| **Day 19** | **Deployment & Infrastructure** | Production environment configuration, Supabase production checks, backend hosting, web portal deployment. | Upcoming |
| **Day 20** | **Final Verification & Presentation** | End-to-end acceptance demo, project report generation, slide deck preparation, portfolio documentation. | Upcoming |

---

## 5. Master Documentation Index

All technical specifications are organized within the `docs/` directory:

1. **[Software Requirements Specification (SRS.md)](docs/SRS.md):** Complete functional modules, MoSCoW prioritization, problem statements, and non-functional requirements.
2. **[System Architecture Specification (ARCHITECTURE.md)](docs/ARCHITECTURE.md):** Architectural diagrams, component boundaries, end-to-end data flows, and tech stack trade-offs.
3. **[Database Architecture Plan (DATABASE_PLAN.md)](docs/DATABASE_PLAN.md):** Detailed relational blueprint of 14 tables, foreign keys, organization scoping, storage buckets, and performance indexes.
4. **[REST API Specification (API_PLAN.md)](docs/API_PLAN.md):** Full REST endpoint inventory across Auth, Complaints, Workflow, and Administration with request/response schemas.
5. **[User Roles & Permissions (USER_ROLES.md)](docs/USER_ROLES.md):** Comprehensive CRUD permissions matrix for 5 roles and anti-privilege escalation architecture.
6. **[Security & Privacy Plan (SECURITY_PLAN.md)](docs/SECURITY_PLAN.md):** Defense-in-depth security, RLS strategy, secret isolation, rate limiting, and India DPDP Act compliance.

---

## 6. Current Status & Next Steps

* **Current Milestone:** **Day 1 Complete** (Architecture, Requirements Engineering & Database Planning).
* **Next Milestone:** **Day 2: UI/UX Design System, Screen Wireframes & Component Architecture**.
