# CivicFix Staff Web Portal

> **Phase:** Day 3 — Development Environment Setup & Project Foundation  
> **Tech Stack:** React 19, Vite 6, TypeScript 5, Tailwind CSS 3, React Router 7, Lucide Icons

The Staff Web Portal is a responsive workspace engineered for municipal field technicians, crew supervisors, and inspectors to triage assignments, record progress, and submit mandatory photo proof of resolution.

---

## 1. Directory Structure

```
staff-portal/
├── src/
│   ├── app/                # App wrapper and router.tsx definitions
│   ├── components/
│   │   ├── layout/         # StaffLayout.tsx (responsive sidebar and header)
│   │   └── ui/             # Reusable Badge, Button, Card, Form components
│   ├── features/
│   │   └── dashboard/      # StaffDashboard.tsx (work orders queue, metrics)
│   ├── lib/
│   │   ├── api/            # apiClient.ts reusable fetch client
│   │   └── config/         # env.ts typed configuration
│   ├── styles/
│   │   └── globals.css     # Tailwind directives and tokens
│   └── main.tsx            # DOM root mounting
├── index.html              # HTML shell with Inter typography
├── package.json            # Scripts and dependencies
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind theme configuration
├── .env.example            # Environment template
└── README.md
```

---

## 2. Setup & Development

```bash
# 1. Install dependencies
cd staff-portal
npm install

# 2. Configure environment variables
copy .env.example .env

# 3. Start Vite dev server on port 5173
npm run dev
```

Visit `http://localhost:5173` to view the portal.

---

## 3. Verification Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite hot-reload development server |
| `npm run build` | Compiles TypeScript and builds production assets into `dist/` |
| `npm run typecheck` | Validates TypeScript types across the codebase |
| `npm run preview` | Previews the compiled production bundle locally |
