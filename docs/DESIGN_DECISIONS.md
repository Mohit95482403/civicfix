# CivicFix Design Decisions & Assumptions
**Phase:** Day 2: UI/UX Design

---

## 1. Resolved Design Decisions

| # | Decision | Rationale |
|:-:|:---|:---|
| 1 | **Primary color #176B5B (Civic Teal)** chosen over civic blue | Teal conveys trust and environmental responsibility — more distinctive than generic blue dashboards. Provides strong contrast on white backgrounds. |
| 2 | **Inter font family** for all platforms | Excellent readability at small sizes, extensive weight range (400–700), free via Google Fonts, works across web and Flutter. |
| 3 | **Bottom tab navigation** for citizen mobile app | One-handed usability on modern tall phones. Follows Android/iOS conventions citizens already understand. |
| 4 | **Collapsible sidebar** for web portals | Maximizes content area on tablets while maintaining desktop navigation context. Consistent pattern across staff and admin portals. |
| 5 | **Card-based complaint list** on mobile; **table-based** on desktop | Cards are touch-friendly and scannable on small screens. Tables enable efficient bulk review for staff/admin workflows. |
| 6 | **5-step complaint wizard** (not single long form) | Reduces cognitive load, shows clear progress, allows easy back-navigation, preserves entered data between steps. |
| 7 | **Internal notes visually separated** with amber left border + lock icon | Prevents accidental confusion between citizen-visible comments and staff-only notes. The amber/lock visual language is distinct and memorable. |
| 8 | **Prototype built as separate React+Vite app** in `design-prototype/` | Keeps prototype isolated from production `staff-portal/` and `admin-portal/` codebases. Prevents prototype code from contaminating Day 3+ production setup. |
| 9 | **Status badges use color + text + icon** (triple encoding) | Ensures accessibility for color-blind users and screen reader users. WCAG 2.2 AA compliance. |
| 10 | **No public staff/admin registration** in any UI | Per Day 1 security plan: staff accounts must be provisioned by authorized Org Admins. Citizen registration form has no role selector. |
| 11 | **Category cards use emoji + text label** in prototype | Emoji provide quick visual recognition. Production app will use custom SVG icons for consistency. |
| 12 | **"Prototype / Demo Data" banner** on all screens | Prevents confusion about live data. Essential ethical boundary for a civic-tech demonstration. |
| 13 | **4px spacing grid** instead of 8px | Finer granularity allows compact form layouts and badge padding without awkward gaps, while still maintaining consistency. |

---

## 2. Assumptions Requiring Future Validation

| # | Assumption | Risk if Invalid | Suggested Resolution |
|:-:|:---|:---|:---|
| 1 | Citizens have smartphones with cameras and GPS capability. | Non-smartphone users cannot report. | Plan SMS/USSD fallback in future iteration. |
| 2 | Supabase Auth supports the required email/password flow without custom extensions. | May need custom auth flow. | Verify during Day 6 implementation. |
| 3 | OpenStreetMap tiles are sufficient for Indian city-level mapping quality. | Poor map detail in smaller cities. | Evaluate Google Maps API as fallback during Day 10. |
| 4 | Staff will primarily access the portal on desktop/tablet, not phone. | Staff portal may need native mobile app. | Monitor usage during pilot; responsive design provides interim mobile support. |
| 5 | The 48-hour reopening window is appropriate for all complaint types. | Some repairs (e.g., road work) may need longer observation. | Make configurable per category in future iteration. |

---

## 3. Unresolved Design Questions for Day 3+

| # | Question | Impact | Target Resolution Day |
|:-:|:---|:---|:---|
| 1 | Should the citizen app support dark mode? | User preference; battery savings on OLED. | Day 7 (Flutter foundation) — add ThemeMode toggle. |
| 2 | Exact SVG icon set for production categories? | Visual consistency. | Day 8 (Complaint submission) — create/source icons. |
| 3 | Push notification content — how much detail? | Privacy vs. usefulness. | Day 15 (Notifications) — define templates. |
| 4 | CSV/PDF export format for admin reports? | Admin utility. | Day 16 (Analytics) — define report templates. |
| 5 | Organization logo upload for white-labeling? | Multi-tenant branding. | Future enhancement — not MVP. |

---

## 4. Day 3 Implementation Plan

Day 3 focuses on **Project Setup & Environment Tooling**:

1. **Flutter Mobile Project** (`mobile/`):
   - Initialize Flutter project with `flutter create`.
   - Add Riverpod, GoRouter, and Supabase Flutter SDK dependencies.
   - Set up folder structure: `lib/features/`, `lib/core/`, `lib/shared/`.
   - Implement design system as Flutter ThemeData using tokens from DESIGN_SYSTEM.md.

2. **Staff Portal** (`staff-portal/`):
   - Initialize React project with `npx create-vite`.
   - Add Tailwind CSS, React Router, Lucide React, Axios.
   - Implement CSS design tokens from DESIGN_SYSTEM.md.
   - Create shared layout component with collapsible sidebar.

3. **Admin Portal** (`admin-portal/`):
   - Same setup as staff portal with admin-specific navigation structure.

4. **Backend** (`backend/`):
   - Initialize Node.js project with `npm init`.
   - Add Express, cors, helmet, dotenv, Supabase JS client.
   - Create modular folder structure: `src/routes/`, `src/middleware/`, `src/controllers/`.
   - Implement health check endpoint: `GET /api/v1/health`.

5. **Database** (`database/`):
   - Create empty migration and seed directories.
   - Prepare `.env.example` templates (no real secrets committed).

6. **Shared Configuration**:
   - ESLint + Prettier for web projects.
   - Root `package.json` with workspace scripts if beneficial.
   - Update `.gitignore` for new project directories.
   - Development setup documentation in each project's README.
