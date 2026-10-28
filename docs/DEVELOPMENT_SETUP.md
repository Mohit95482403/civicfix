# CivicFix Development Environment Setup Guide
**Document Version:** 1.0.0  
**Phase:** Day 3: Development Environment Setup and Project Foundation  
**Status:** Approved Baseline  

---

## 1. Prerequisites & Required Tooling

To contribute to or run the CivicFix platform, ensure the following core tools are installed on your workstation:

| Tool | Tested Version | Minimum Required | Installation Source / Verification |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v24.18.0` LTS | `>= 20.0.0` | [nodejs.org](https://nodejs.org/) (`node -v`) |
| **npm** | `11.16.0` | `>= 10.0.0` | Bundled with Node (`npm -v`) |
| **Flutter SDK** | `3.44.9` (stable) | `>= 3.22.0` | [docs.flutter.dev](https://docs.flutter.dev/get-started/install) (`flutter --version`) |
| **Dart SDK** | `3.12.2` | `>= 3.4.0` | Bundled with Flutter (`dart --version`) |
| **Git** | `2.4x+` | `>= 2.30.0` | [git-scm.com](https://git-scm.com/) (`git --version`) |
| **VS Code / Android Studio** | Latest | N/A | Recommended IDE with Flutter & React extensions |

---

## 2. Monorepo & Directory Overview

```
civicfix/
├── mobile/                     # Flutter citizen mobile application
├── staff-portal/               # React + Vite field technician web portal
├── admin-portal/               # React + Vite municipal administrative portal
├── backend/                    # Node.js + Express REST API gateway
├── database/                   # Migrations, schema definitions & seeds (Day 4)
├── design-prototype/           # Day 2 interactive prototype
├── docs/                       # Comprehensive engineering & architecture specs
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 3. Dependency Installation

Execute dependency installation in each application directory:

```bash
# 1. Backend REST API
cd backend
npm install

# 2. Staff Web Portal
cd ../staff-portal
npm install

# 3. Admin Web Portal
cd ../admin-portal
npm install

# 4. Flutter Citizen Mobile App
cd ../mobile
flutter pub get
```

---

## 4. Local Development Execution & Ports

Each tier operates on a dedicated local port to prevent port collisions:

| Application | Technology | Default Port / URL | Start Command |
| :--- | :--- | :--- | :--- |
| **Backend REST API** | Express.js / TypeScript | `http://localhost:5000` | `npm --prefix backend run dev` |
| **Staff Web Portal** | React / Vite / TS | `http://localhost:5173` | `npm --prefix staff-portal run dev` |
| **Admin Web Portal** | React / Vite / TS | `http://localhost:5174` | `npm --prefix admin-portal run dev` |
| **Interactive Prototype** | React / Vite | `http://localhost:5175` | `npm --prefix design-prototype run dev` |
| **Citizen Mobile App** | Flutter / Dart | Mobile Device / Emulator | `cd mobile && flutter run` |

### Orchestrated Root Scripts

From the root repository directory:
```bash
# Run backend development server
npm run dev:backend

# Run staff portal
npm run dev:staff

# Run admin portal
npm run dev:admin

# Run interactive prototype
npm run dev:prototype

# Verify TypeScript types across all web and backend services
npm run check:all

# Build all production web bundles and backend TypeScript
npm run build:all
```

---

## 5. Troubleshooting & Common Pitfalls

### Issue: Port 5000 Already in Use
* **Cause:** Another background node process or system service is occupying port 5000.
* **Fix (Windows PowerShell):**
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
  ```
  Or change `PORT=5001` in `backend/.env`.

### Issue: Vite `Property 'env' does not exist on type 'ImportMeta'`
* **Cause:** Missing Vite client ambient typings.
* **Fix:** Ensure `src/vite-env.d.ts` contains `/// <reference types="vite/client" />`.

### Issue: Flutter Android Emulator cannot reach `http://localhost:5000`
* **Cause:** Android emulators map `localhost` to the emulator device itself, not the host machine.
* **Fix:** In `mobile/lib/core/config/env_config.dart`, the base URL is set to `http://10.0.2.2:5000/api/v1` for Android emulator loopback.
