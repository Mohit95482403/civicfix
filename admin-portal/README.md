# CivicFix Admin Web Portal

> **Phase:** Day 3 — Development Environment Setup & Project Foundation  
> **Tech Stack:** React 19, Vite 6, TypeScript 5, Tailwind CSS 3, React Router 7, Lucide Icons

The Admin Web Portal is the centralized municipal management dashboard for city administrators, department heads, and operational supervisors to monitor incident triage, dispatch staff, configure SLA thresholds, and audit operations.

---

## 1. Directory Structure

```
admin-portal/
├── src/
│   ├── app/                # App wrapper and router.tsx definitions
│   ├── components/
│   │   ├── layout/         # AdminLayout.tsx (responsive sidebar and header)
│   │   └── ui/             # Reusable Badge, Button, Card, Form components
│   ├── features/
│   │   └── dashboard/      # AdminDashboard.tsx (KPIs, triage table, workloads)
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
cd admin-portal
npm install

# 2. Configure environment variables
copy .env.example .env

# 3. Start Vite dev server on port 5174
npm run dev
```

Visit `http://localhost:5174` to view the portal.

---

## 3. Verification Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite hot-reload development server |
| `npm run build` | Compiles TypeScript and builds production assets into `dist/` |
| `npm run typecheck` | Validates TypeScript types across the codebase |
| `npm run preview` | Previews the compiled production bundle locally |
