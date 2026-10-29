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
| **Day 2** | **UI/UX Design & Design System** | Design system tokens, screen inventory (41 screens), user flows, wireframes, WCAG 2.2 AA accessibility, responsive rules, and interactive prototype. | **COMPLETED** |
| **Day 3** | **Project Setup & Environment Tooling** | Multi-tier setup: Flutter (Riverpod, GoRouter, Dio), React + Vite staff & admin portals (Tailwind CSS, TS), Node/Express API (TypeScript, Zod, Helmet, CORS), and master documentation. | **COMPLETED** |
| **Day 4** | **Supabase Project & PostgreSQL Schema** | Production PostgreSQL schema, 9 ordered migrations, 14 tables, custom domain ENUMs, single active assignee constraint, RLS policies across all tables, seed data, and verification scripts. | **COMPLETED** |
| **Day 5** | **Backend Foundation & Database Security** | Express REST API gateway, Supabase Auth token verification, RBAC & multi-tenant authorization middleware, Zod request validation, standardized API responses, structured logging with redaction, rate limiting, and 30 automated Vitest tests. | **COMPLETED** |
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

All architectural, system, and development specifications are organized within the `docs/` directory:

### Architecture & Engineering (Day 1)
1. **[Software Requirements Specification (SRS.md)](docs/SRS.md):** Complete functional modules, MoSCoW prioritization, problem statements, and non-functional requirements.
2. **[System Architecture Specification (ARCHITECTURE.md)](docs/ARCHITECTURE.md):** Architectural diagrams, component boundaries, end-to-end data flows, and tech stack trade-offs.
3. **[Database Architecture Plan (DATABASE_PLAN.md)](docs/DATABASE_PLAN.md):** Relational blueprint of 14 tables, foreign keys, organization scoping, storage buckets, and performance indexes.
4. **[REST API Specification (API_PLAN.md)](docs/API_PLAN.md):** Full REST endpoint inventory across Auth, Complaints, Workflow, and Administration with request/response schemas.
5. **[User Roles & Permissions (USER_ROLES.md)](docs/USER_ROLES.md):** Comprehensive CRUD permissions matrix for 5 roles and anti-privilege escalation architecture.
6. **[Security & Privacy Plan (SECURITY_PLAN.md)](docs/SECURITY_PLAN.md):** Defense-in-depth security, RLS strategy, secret isolation, rate limiting, and India DPDP Act compliance.

### UI/UX Design System & Screen Architecture (Day 2)
7. **[Design System Specification (DESIGN_SYSTEM.md)](docs/DESIGN_SYSTEM.md):** Color tokens (Civic Teal, Warm Gold), typography scale, 10-state badge rules, spacing, and mobile/web touch target standards.
8. **[Complete Screen Inventory (SCREEN_INVENTORY.md)](docs/SCREEN_INVENTORY.md):** 41 documented screens across Citizen Mobile (16), Staff Portal (12), and Admin Dashboard (13).
9. **[Detailed User Flows (USER_FLOWS.md)](docs/USER_FLOWS.md):** 10 critical end-to-end workflows including complaint submission, triage dispatch, proof-of-work resolution, and feedback closure.
10. **[Screen Wireframe Descriptions (WIREFRAMES.md)](docs/WIREFRAMES.md):** Spatial zoning, visual hierarchies, and component layouts for every core screen.
11. **[Responsive Design Guidelines (RESPONSIVE_GUIDELINES.md)](docs/RESPONSIVE_GUIDELINES.md):** Breakpoint standards, navigation adapters, fluid data tables, and mobile-first ergonomics.
12. **[Accessibility Compliance Standards (ACCESSIBILITY_GUIDELINES.md)](docs/ACCESSIBILITY_GUIDELINES.md):** WCAG 2.2 Level AA compliance, 4.5:1 minimum contrast, ARIA landmarks, and 44x44px touch targets.
13. **[Design Decisions & Assumptions (DESIGN_DECISIONS.md)](docs/DESIGN_DECISIONS.md):** Rationale for color, typography, lifecycle states, resolved assumptions, and Day 3 implementation handoff.

### Development Environment & Engineering Tooling (Day 3)
14. **[Development Setup Guide (DEVELOPMENT_SETUP.md)](docs/DEVELOPMENT_SETUP.md):** Prerequisite tools, local ports, multi-tier run scripts, and troubleshooting.
15. **[Environment Variables Specification (ENVIRONMENT_VARIABLES.md)](docs/ENVIRONMENT_VARIABLES.md):** Variable inventory across all 4 applications, secret isolation rules, and security boundaries.
16. **[Supabase Setup & Architecture (SUPABASE_SETUP.md)](docs/SUPABASE_SETUP.md):** Step-by-step Supabase guide, credential management, private storage buckets, and RLS strategy.
17. **[API Development Guide (API_DEVELOPMENT.md)](docs/API_DEVELOPMENT.md):** Express conventions, health endpoint, error responses, cURL/Postman testing, and route module guide.
18. **[Project Structure Reference (PROJECT_STRUCTURE.md)](docs/PROJECT_STRUCTURE.md):** Master repository breakdown detailing each folder's role and purpose.

### Database Architecture, Migrations & RLS (Day 4)
19. **[Database Schema Specification (DATABASE_SCHEMA.md)](docs/DATABASE_SCHEMA.md):** Table-by-table schema, column types, check constraints, default values, and index definitions.
20. **[Database Relationships & ER Model (DATABASE_RELATIONSHIPS.md)](docs/DATABASE_RELATIONSHIPS.md):** Mermaid ER diagram, foreign key deletion policies (`RESTRICT` vs `CASCADE`), and cardinality rules.
21. **[Row Level Security Policies (RLS_POLICIES.md)](docs/RLS_POLICIES.md):** Table-by-table RLS matrix, security-definer helper functions, internal notes shielding, and audit immutability.
22. **[Database Migrations Guide (DATABASE_MIGRATIONS.md)](docs/DATABASE_MIGRATIONS.md):** Migration naming standards, execution sequence, CLI / Dashboard execution, and rollback strategies.
23. **[Database Testing & Verification (DATABASE_TESTING.md)](docs/DATABASE_TESTING.md):** Data integrity test cases, security boundary test scenarios, static analysis findings, and verification script instructions.

### Authentication, Profiles & Session Management (Day 6)
28. **[Authentication Specification (AUTHENTICATION.md)](docs/AUTHENTICATION.md):** Supabase Auth integration, registration, login, logout, password recovery, session refresh, and token extraction.
29. **[Authorization Specification (AUTHORIZATION.md)](docs/AUTHORIZATION.md):** 5-tier role hierarchy, anti-privilege escalation guards, administrative staff provisioning, and multi-tenant isolation.
30. **[Supabase Setup & Configuration Guide (SUPABASE_SETUP.md)](docs/SUPABASE_SETUP.md):** Dashboard auth settings, email confirmation, deep linking redirect URLs, and database trigger sync.
31. **[Profile Management Specification (PROFILE_MANAGEMENT.md)](docs/PROFILE_MANAGEMENT.md):** Profile schema, 1:1 foreign key linkage, allowed editable fields, and self-healing recovery fallback.
32. **[Authentication & Authorization Testing Suite (AUTH_TESTING.md)](docs/AUTH_TESTING.md):** 54 automated Vitest tests, unit & integration test coverage matrix, and cURL manual test scripts.

---

## 6. Applications & Workspace Layout

```
civicfix/
├── mobile/                     # Flutter citizen app (Riverpod 3, GoRouter 18, Dio 5, Auth flow)
├── staff-portal/               # React 19 + Vite 6 staff portal (Auth Context, Protected Routes)
├── admin-portal/               # React 19 + Vite 6 admin portal (Admin Auth Guard, Role Check)
├── backend/                    # Node 20+ Express REST API (TypeScript 5, Supabase Auth, Zod)
│   ├── src/                    # Controllers, middleware, routes, services, validators, utils
│   └── tests/                  # 54 automated Vitest unit & integration tests (100% passing)
├── database/                   # Migrations, seed scripts, and verification tests
│   ├── migrations/             # 9 ordered PostgreSQL DDL scripts (001 to 009)
│   ├── seeds/                  # Pilot municipal seeds (BBMP, PMC) and sample tickets
│   └── tests/                  # Executable schema verification script
├── design-prototype/           # Day 2 interactive prototype (React 19 + Vite)
├── docs/                       # 32 master architecture & engineering specifications
└── package.json                # Root orchestration scripts
```

---

## 7. Current Status & Next Steps

* **Current Milestone:** **Day 6 Complete** (Complete Authentication, Registration, Login, Profiles & Session Management).
* **Next Milestone:** **Day 7: Flutter Citizen Mobile App Foundation, Bottom Navigation & Architecture**.



