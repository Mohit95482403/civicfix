# CivicFix Master Project Structure Reference
**Document Version:** 1.0.0  
**Phase:** Day 3: Development Environment Setup and Project Foundation  
**Status:** Approved Baseline  

---

## 1. Directory Tree Overview

```
civicfix/
│
├── mobile/                     # Flutter citizen cross-platform mobile application
│   ├── android/                # Native Android Gradle configuration
│   ├── ios/                    # Native iOS Xcode workspace
│   ├── lib/                    # Dart source code organized by feature
│   │   ├── app/                # Root CivicFixApp, GoRouter, Theme
│   │   ├── core/               # EnvConfig, Network (Dio ApiClient), Error types
│   │   ├── features/           # Feature-first modules (Home, Complaints, Auth)
│   │   └── shared/             # Reusable UI widgets and models
│   ├── test/                   # Automated widget and unit tests
│   ├── pubspec.yaml            # Flutter package manifest (Riverpod, GoRouter, Dio)
│   └── README.md
│
├── staff-portal/               # React + Vite field technician web portal
│   ├── src/
│   │   ├── app/                # React Router setup & Root App shell
│   │   ├── components/         # Reusable UI (Badge, Card, Button) & StaffLayout
│   │   ├── features/           # Work order queue, inspection, resolution submit
│   │   ├── lib/                # Config, typed API client (Fetch)
│   │   └── styles/             # Tailwind CSS & design tokens
│   ├── vite.config.ts          # Vite build tooling (Port 5173)
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── admin-portal/               # React + Vite municipal administrative management console
│   ├── src/
│   │   ├── app/                # React Router setup & Root App shell
│   │   ├── components/         # Reusable UI (Badge, Card, Button) & AdminLayout
│   │   ├── features/           # Executive KPIs, triage queue, departments, audit
│   │   ├── lib/                # Config, typed API client (Fetch)
│   │   └── styles/             # Tailwind CSS & design tokens
│   ├── vite.config.ts          # Vite build tooling (Port 5174)
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── backend/                    # Node.js + Express REST API gateway
│   ├── src/
│   │   ├── config/             # Zod environment validation (env.ts)
│   │   ├── middleware/         # Request ID, centralized error handler, 404 handler
│   │   ├── routes/             # Health routes, versioned /api/v1 router
│   │   ├── utils/              # Structured logger with secret redaction
│   │   ├── app.ts              # Express application with Helmet & CORS
│   │   └── server.ts           # Server entry point & graceful shutdown
│   ├── dist/                   # Compiled production JavaScript (gitignored)
│   ├── tsconfig.json           # TypeScript configuration
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── database/                   # Relational database migrations & seeds
│   ├── migrations/             # Incremental PostgreSQL DDL scripts (Day 4)
│   ├── seeds/                  # Seed datasets (categories, test users)
│   └── README.md
│
├── design-prototype/           # Day 2 interactive design prototype (React 19 + Vite)
│
├── docs/                       # Architectural, system & engineering specifications
│   ├── SRS.md                  # Software Requirements Specification (Day 1)
│   ├── ARCHITECTURE.md         # System Architecture & Flow Diagrams (Day 1)
│   ├── DATABASE_PLAN.md        # Database Blueprint, 14 Tables & RLS (Day 1)
│   ├── API_PLAN.md             # REST API Endpoint Inventory (Day 1)
│   ├── USER_ROLES.md           # 5 User Roles & Permission Matrix (Day 1)
│   ├── SECURITY_PLAN.md        # Defense-in-Depth Security & DPDP Compliance (Day 1)
│   ├── DESIGN_SYSTEM.md        # Design System Tokens & Badges (Day 2)
│   ├── SCREEN_INVENTORY.md     # 41 Screen Inventory (Day 2)
│   ├── USER_FLOWS.md           # 10 Detailed User Flows (Day 2)
│   ├── WIREFRAMES.md           # Screen Wireframe Blueprints (Day 2)
│   ├── RESPONSIVE_GUIDELINES.md# Responsive Design Rules (Day 2)
│   ├── ACCESSIBILITY_GUIDELINES.md # WCAG 2.2 AA Compliance (Day 2)
│   ├── DESIGN_DECISIONS.md     # Design Decisions & Handoff (Day 2)
│   ├── DEVELOPMENT_SETUP.md    # Local Development Setup & Tooling (Day 3)
│   ├── ENVIRONMENT_VARIABLES.md# Master Environment Variable Matrix (Day 3)
│   ├── SUPABASE_SETUP.md       # Supabase Project, RLS & Storage Plan (Day 3)
│   ├── API_DEVELOPMENT.md      # Backend API Conventions & Testing (Day 3)
│   └── PROJECT_STRUCTURE.md    # Master Directory & Repository Structure (Day 3)
│
├── .editorconfig               # Cross-editor formatting rules
├── .gitattributes              # Line-ending and binary file definitions
├── .gitignore                  # Comprehensive Git exclusion rules
├── package.json                # Workspace orchestration scripts
└── README.md                   # Project overview, roadmap & status guide
```
