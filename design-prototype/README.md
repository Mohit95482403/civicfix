# CivicFix Interactive Design Prototype

> **Phase:** Day 2 — UI/UX Design System, Screen Architecture & Interactive Prototypes  
> **Tech Stack:** React 19, Vite 8, Lucide React, Custom CSS Design System

This directory houses the interactive frontend prototype for **CivicFix** ("*Report It. Track It. Improve Your City.*"), demonstrating the user interface, component hierarchy, responsive layouts, and cross-role workflows across all three target platforms.

---

## 1. Prototype Experiences

Use the top navigation bar to seamlessly switch between the four built-in modules:

1. **📱 Citizen Mobile App Simulation**
   - Interactive smartphone shell mockup (switchable to full-bleed responsive web view).
   - Feed of nearby civic issues with category filters and search.
   - Stepped issue filing wizard (`NewComplaintModal`): Category picker, photographic evidence attach, GPS location drop, severity flags.
   - Live tracking reference generation (e.g. `CF-2026-BLR-001043`).
   - "My Submitted Reports" tab.

2. **👷‍♂️ Field Staff & Supervisor Portal**
   - Field technician dispatch queue for assigned civic work orders.
   - Urgent priority and SLA countdown indicators.
   - Interactive status update flow: `ASSIGNED` → `IN_PROGRESS` → `RESOLVED`.
   - Mandatory proof-of-work photo attachment simulation modal upon completion.

3. **🏛️ Municipal Admin Dashboard**
   - Executive civic health metrics (Total tickets, Pending triage, SLA turnaround, Citizen approval rating).
   - Real-time complaints triage matrix with search, status filtering, and technician dispatch modal.
   - Department workload and SLA compliance targets table.
   - DPDP Act compliant system audit log viewer.

4. **🎨 Design Tokens & UI Specs**
   - Click-to-copy color swatch tokens (Civic Teal, Warm Gold, Muted Slate, Semantic Alert colors).
   - Standardized 10-state complaint lifecycle badge system.
   - Type scale (Inter, 12px to 30px) with contrast ratios.
   - Button, input, and modal component states.

---

## 2. Running Locally

```bash
# Navigate to the prototype directory
cd design-prototype

# Install dependencies
npm install

# Start the Vite local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

To build the static production bundle:

```bash
npm run build
```

---

## 3. Directory Structure

```
design-prototype/
├── public/                 # Static assets and icons
├── src/
│   ├── assets/             # Brand logos and illustrations
│   ├── components/         # Modular interactive views
│   │   ├── Navbar.jsx               # Role switcher and prototype header
│   │   ├── CitizenView.jsx          # Mobile phone mockup and citizen feed
│   │   ├── StaffView.jsx            # Field technician work order queue
│   │   ├── AdminView.jsx            # City management and triage dashboard
│   │   ├── DesignSystemView.jsx     # Interactive token explorer
│   │   ├── ComplaintDetailModal.jsx # Full lifecycle timeline and comments
│   │   └── NewComplaintModal.jsx    # Stepped report creation wizard
│   ├── data/
│   │   └── mockData.js     # Realistic civic dataset, categories, and staff
│   ├── styles/
│   │   └── design-system.css # Complete CSS custom properties and tokens
│   ├── App.css             # Prototype layout, smartphone mockup, and tables
│   ├── App.jsx             # State orchestration connecting all views
│   ├── index.css           # Global resets and CSS variables
│   └── main.jsx            # Application entry point
├── index.html              # HTML shell with Google Fonts & metadata
├── package.json            # Project dependencies and build scripts
└── vite.config.js          # Vite configuration
```
