# CivicFix Responsive Design Guidelines
**Phase:** Day 2: UI/UX Design

---

## 1. Breakpoint System

| Breakpoint | Width Range | Target Devices | Layout Strategy |
|:---|:---|:---|:---|
| **Mobile** | 320px – 430px | Android/iOS phones | Single column, bottom nav, full-width cards |
| **Tablet** | 768px – 1024px | Tablets, small laptops | Collapsible sidebar, 2-column grids |
| **Desktop** | 1280px – 1440px | Standard desktop monitors | Fixed sidebar, multi-column layouts, data tables |
| **Wide Desktop** | 1600px+ | Wide monitors | Max-width container (1440px), centered, extra whitespace |

---

## 2. Citizen Mobile App (Flutter) — Responsive Rules

### Layout Principles
- **Single-column layout** throughout — no side-by-side panels on mobile.
- **Bottom navigation bar** with 4 tabs: Home, Complaints, Map, Profile.
- **Primary CTA** ("Report an Issue") always visible on home screen without scrolling.
- **Large touch targets**: Minimum 48×48dp tap area (exceeds Material 44dp recommendation).
- **No horizontal scrolling** except for photo carousels and category selection overflow.

### Category Grid
- **2 columns** on 360px+ screens (cards ~160dp wide).
- **3 columns** on tablets (430px+) in landscape orientation.

### Form Steps
- Full-width input fields with 16px horizontal padding.
- Step indicator at top — compact horizontal stepper.
- "Next" button anchored at bottom of visible area (above keyboard when active).

### Photo Gallery
- Horizontal scroll of thumbnail previews (80×80dp).
- Tap to view full-size with pinch-to-zoom.

### Map View
- Full-screen map with floating search bar at top.
- Floating filter chips below search bar.
- Bottom sheet for complaint list (draggable half-screen / full-screen).

---

## 3. Staff Web Portal — Responsive Rules

### Desktop (1280px+)
- **Fixed left sidebar** (240px wide) with navigation links.
- **Main content area**: `calc(100% - 240px)`.
- **Complaint queue**: Full data table with 7+ visible columns.
- **Complaint detail**: Two-column layout — main content (65%) + sidebar panel (35%).

### Tablet (768px – 1279px)
- **Collapsible sidebar**: Icon-only mode (64px) with tooltip labels. Hamburger toggle to expand.
- **Complaint queue**: Reduced columns — hide less critical ones (e.g., category, priority show on hover/expand).
- **Complaint detail**: Single-column stacked layout.

### Mobile (< 768px)
- **Hidden sidebar**: Hamburger menu opens as overlay drawer.
- **Complaint queue**: Card-based layout instead of table rows.
  - Each card shows: Reference, Title, Status badge, Last updated.
  - Tap to expand or navigate to detail.
- **Complaint detail**: Full single-column stack.

### Table Responsive Strategy
Tables never use horizontal scroll by default. Instead:
1. **Priority columns** always visible: Reference, Title, Status, Actions.
2. **Secondary columns** hidden at tablet: Category, Submission Date.
3. **Tertiary columns** hidden at mobile: Assigned Staff, Department.
4. Action menu (⋮) always visible in last column.
5. Row tap opens detail view on mobile/tablet.

---

## 4. Admin Web Portal — Responsive Rules

### Desktop (1280px+)
- **Fixed left sidebar** (260px) with grouped navigation sections.
- **Dashboard**: 4-column metric cards → 2-column chart grid.
- **Data tables**: Full column visibility with inline actions.
- **Modals**: Centered overlay, max-width 560px (standard), 800px (large).

### Tablet (768px – 1279px)
- **Collapsible sidebar**: Icon-only (64px) with expand toggle.
- **Dashboard**: 2-column metric cards → single-column chart stack.
- **Data tables**: 5 priority columns; secondary columns hidden.
- **Modals**: Full-width with 24px margins.

### Mobile (< 768px)
- **Hidden sidebar**: Hamburger overlay drawer.
- **Dashboard**: Single-column metric cards → single-column charts.
- **Data tables**: Card-based layout.
- **Forms**: Full-width single column.
- **Modals**: Full-screen bottom sheet style.

---

## 5. Max-Width Containment

All page content is constrained within a centered container:
- **Mobile**: 100% width with 16px padding.
- **Tablet**: 100% width with 24px padding.
- **Desktop**: Max 1200px content width within sidebar-adjacent area.
- **Wide Desktop**: Max 1440px total width, centered with auto margins.

---

## 6. Navigation Patterns

| Application | Mobile | Tablet | Desktop |
|:---|:---|:---|:---|
| **Citizen App** | Bottom tab bar (4 items) | Bottom tab bar | N/A (mobile-only) |
| **Staff Portal** | Hamburger → Overlay drawer | Collapsible icon sidebar | Fixed expanded sidebar |
| **Admin Portal** | Hamburger → Overlay drawer | Collapsible icon sidebar | Fixed expanded sidebar |

---

## 7. Typography Scaling

Font sizes do not change dramatically between breakpoints. Instead:
- **Mobile**: Base sizes as defined in design system (14px body).
- **Tablet**: Same base sizes; page titles may increase to 28px.
- **Desktop**: Same base sizes; display headings may increase to 32px.
- Line lengths capped at 72 characters for body text readability.
