# CivicFix Design System Specification
**Document Version:** 1.0.0  
**Phase:** Day 2: UI/UX Design System, Screen Architecture & Interactive Prototypes  
**Status:** Approved Baseline

---

## 1. Brand Identity

### 1.1 Brand Personality
CivicFix conveys: **Trust · Transparency · Public Responsibility · Efficiency · Accessibility · Community Participation · Accountability · Modern Technology**.

The visual language avoids generic dashboard aesthetics, outdated government portal styles, gaming interfaces, and flashy cryptocurrency aesthetics. Instead, it communicates civic professionalism with warmth and approachability.

### 1.2 Logo Concept
The CivicFix logo combines a **location pin** silhouette with an embedded **checkmark**, symbolizing "civic issues identified → resolved." The wordmark uses the Inter typeface at SemiBold weight.

- Works on both light (#FFFFFF) and dark (#172B3A) backgrounds.
- Maintains legibility at 24×24px app icon size.
- Uses geometric shapes — no photographic or illustrative elements.
- Does not reference any government emblem.

### 1.3 Tagline
*"Report It. Track It. Improve Your City."*

---

## 2. Color System

### 2.1 Primary Palette

| Token | Hex | Usage |
|:---|:---|:---|
| `--color-primary` | `#176B5B` | Primary actions, links, active navigation, key CTA backgrounds |
| `--color-primary-hover` | `#115447` | Hover/pressed state for primary elements |
| `--color-primary-light` | `#E8F4F0` | Soft backgrounds, selected row highlights, tag backgrounds |
| `--color-accent` | `#F4B942` | Secondary CTA, highlights, star ratings, attention-drawing elements |
| `--color-accent-hover` | `#D9A336` | Hover state for accent elements |

### 2.2 Neutral Palette

| Token | Hex | Usage |
|:---|:---|:---|
| `--color-bg-main` | `#F7F9FC` | Application background |
| `--color-bg-surface` | `#FFFFFF` | Cards, panels, modals, dropdowns |
| `--color-text-primary` | `#172B3A` | Headings, primary body text |
| `--color-text-secondary` | `#617386` | Supporting text, timestamps, metadata |
| `--color-text-tertiary` | `#94A3B8` | Placeholder text, disabled labels |
| `--color-border` | `#E2E8F0` | Input borders, card borders, dividers |
| `--color-border-focus` | `#176B5B` | Focused input borders |
| `--color-bg-hover` | `#F1F5F9` | Row hover, button hover backgrounds |

### 2.3 Semantic Palette

| Token | Hex | Usage | Status Mapping |
|:---|:---|:---|:---|
| `--color-success` | `#16845B` | Resolved, verified, positive feedback | RESOLVED, VERIFIED, CLOSED |
| `--color-success-light` | `#DCFCE7` | Success badge background | — |
| `--color-warning` | `#B7791F` | SLA warnings, pending actions | UNDER_REVIEW, REOPENED |
| `--color-warning-light` | `#FEF3C7` | Warning badge background | — |
| `--color-error` | `#C83B3B` | Rejections, errors, destructive actions | REJECTED |
| `--color-error-light` | `#FEE2E2` | Error badge background | — |
| `--color-info` | `#2463B5` | Informational, in-progress states | SUBMITTED, ASSIGNED, IN_PROGRESS |
| `--color-info-light` | `#DBEAFE` | Info badge background | — |
| `--color-duplicate` | `#7C3AED` | Duplicate status indicator | DUPLICATE |
| `--color-duplicate-light` | `#EDE9FE` | Duplicate badge background | — |

### 2.4 Contrast Compliance
All text-on-background pairings meet WCAG 2.2 AA minimum contrast ratio (4.5:1 for normal text, 3:1 for large text). Badge text uses dark-on-light pairings for accessibility.

---

## 3. Complaint Status Badge Mapping

| Internal Status | User-Facing Label | Badge Color | Icon Suggestion |
|:---|:---|:---|:---|
| `SUBMITTED` | Submitted | Info (Blue) | `📋` / `FileText` |
| `UNDER_REVIEW` | Under Review | Warning (Amber) | `🔍` / `Search` |
| `VERIFIED` | Verified | Success (Green) | `✓` / `CheckCircle` |
| `ASSIGNED` | Assigned | Info (Blue) | `👤` / `UserCheck` |
| `IN_PROGRESS` | In Progress | Info (Blue) | `🔧` / `Wrench` |
| `RESOLVED` | Resolved | Success (Green) | `✅` / `CheckCircle2` |
| `CLOSED` | Closed | Neutral (Slate) | `🔒` / `Lock` |
| `REOPENED` | Reopened | Warning (Amber) | `🔄` / `RefreshCw` |
| `REJECTED` | Rejected | Error (Red) | `✕` / `XCircle` |
| `DUPLICATE` | Duplicate | Duplicate (Purple) | `📎` / `Copy` |

Every badge includes both the color indicator and a readable text label. Colors alone never convey status.

---

## 4. Typography System

**Primary Font:** Inter (Google Fonts) — loaded weights: 400, 500, 600, 700.

| Token | Size | Weight | Line Height | Usage |
|:---|:---|:---|:---|:---|
| `--font-display` | 30px / 1.875rem | 700 (Bold) | 1.2 | Hero headings, landing page |
| `--font-page-title` | 24px / 1.5rem | 600 (SemiBold) | 1.3 | Page titles (Dashboard, Complaints) |
| `--font-section-heading` | 20px / 1.25rem | 600 (SemiBold) | 1.35 | Section headers within pages |
| `--font-card-title` | 16px / 1rem | 600 (SemiBold) | 1.4 | Card headings, table column headers |
| `--font-body` | 14px / 0.875rem | 400 (Regular) | 1.5 | Default body text, descriptions |
| `--font-body-medium` | 14px / 0.875rem | 500 (Medium) | 1.5 | Emphasized body text, navigation links |
| `--font-supporting` | 13px / 0.8125rem | 400 (Regular) | 1.45 | Timestamps, metadata, helper text |
| `--font-label` | 12px / 0.75rem | 500 (Medium) | 1.4 | Form labels, badge text, overlines |
| `--font-button` | 14px / 0.875rem | 500 (Medium) | 1 | Button labels |
| `--font-metric` | 28px / 1.75rem | 700 (Bold) | 1.2 | Dashboard KPI numbers |
| `--font-metric-label` | 12px / 0.75rem | 500 (Medium) | 1.3 | Labels under metrics |

---

## 5. Spacing Scale (4px base grid)

| Token | Value | Usage |
|:---|:---|:---|
| `--space-1` | 4px | Compact icon gaps, inline badge padding |
| `--space-2` | 8px | Small gaps between icon and label, list item spacing |
| `--space-3` | 12px | Compact component padding, button padding |
| `--space-4` | 16px | Standard component padding, input padding, card internal spacing |
| `--space-5` | 20px | Form field vertical gap |
| `--space-6` | 24px | Card padding, section internal spacing |
| `--space-8` | 32px | Major grouping, dashboard card gap |
| `--space-10` | 40px | Page section separators |
| `--space-12` | 48px | Major section spacing |
| `--space-16` | 64px | Large desktop section spacing |

---

## 6. Border Radius Tokens

| Token | Value | Usage |
|:---|:---|:---|
| `--radius-sm` | 4px | Small controls, badges, tags |
| `--radius-md` | 6px | Inputs, selects, buttons |
| `--radius-lg` | 8px | Cards, panels, dropdowns |
| `--radius-xl` | 12px | Modal windows, large panels |
| `--radius-2xl` | 16px | Mobile bottom sheets |
| `--radius-full` | 9999px | Avatars, circular buttons, pills |

---

## 7. Shadow System

| Token | Value | Usage |
|:---|:---|:---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Buttons, small elements |
| `--shadow-md` | `0 2px 8px rgba(0,0,0,0.08)` | Cards, dropdowns |
| `--shadow-lg` | `0 4px 16px rgba(0,0,0,0.10)` | Modals, popovers |
| `--shadow-xl` | `0 8px 32px rgba(0,0,0,0.12)` | Large overlay dialogs |

Shadows are subtle. No heavy glassmorphism, neon glows, or deep drop-shadows.

---

## 8. Iconography

**Icon Library:** Lucide React (web portals) / Flutter's built-in Material Icons + custom SVG icons (mobile)

- Icons support meaning alongside text — they never replace text labels for critical actions.
- Icon size: 16px inline, 20px in buttons, 24px in navigation.
- Icon color inherits from text color by default; semantic icons use semantic colors.

---

## 9. Button Variants

| Variant | Background | Text | Border | Usage |
|:---|:---|:---|:---|:---|
| **Primary** | `--color-primary` | `#FFFFFF` | none | Main CTA: Submit, Assign, Save |
| **Primary Hover** | `--color-primary-hover` | `#FFFFFF` | none | Hover state |
| **Secondary** | `transparent` | `--color-primary` | `1px solid --color-primary` | Secondary actions: Cancel, Filter |
| **Danger** | `--color-error` | `#FFFFFF` | none | Destructive: Reject, Delete |
| **Ghost** | `transparent` | `--color-text-secondary` | none | Tertiary: Close, Dismiss |
| **Disabled** | `#E2E8F0` | `#94A3B8` | none | Disabled state |

All buttons have: `border-radius: var(--radius-md)`, `padding: 10px 20px`, `font: var(--font-button)`, `cursor: pointer`, `transition: 0.15s ease`.

---

## 10. Input / Form Field Variants

| State | Border | Background | Text |
|:---|:---|:---|:---|
| Default | `--color-border` | `--color-bg-surface` | `--color-text-primary` |
| Focus | `--color-border-focus` (2px) | `--color-bg-surface` | `--color-text-primary` |
| Error | `--color-error` | `#FFF5F5` | `--color-text-primary` |
| Disabled | `#E2E8F0` | `#F1F5F9` | `--color-text-tertiary` |

All inputs: `border-radius: var(--radius-md)`, `padding: 10px 14px`, `font: var(--font-body)`, visible labels above, helper text below.

---

## 11. Component Design Standards

### Cards
- Background: `--color-bg-surface`
- Border: `1px solid --color-border`
- Radius: `--radius-lg`
- Shadow: `--shadow-md`
- Padding: `--space-6`

### Tables
- Header: `--color-bg-main`, `--font-label` weight 500, uppercase
- Rows: alternating white/`--color-bg-main`
- Row hover: `--color-bg-hover`
- Cell padding: `--space-3` vertical, `--space-4` horizontal

### Modals / Dialogs
- Overlay: `rgba(23, 43, 58, 0.5)`
- Background: `--color-bg-surface`
- Radius: `--radius-xl`
- Shadow: `--shadow-xl`
- Max-width: 560px (standard), 800px (large)

### Toast Notifications
- Position: Top-right (web), top (mobile)
- Duration: 4 seconds auto-dismiss
- Variants: Success (green left accent), Error (red), Warning (amber), Info (blue)

---

## 12. Accessibility Guidelines Summary

1. All text meets WCAG 2.2 AA contrast requirements (4.5:1 minimum).
2. All interactive elements have visible focus outlines (2px solid `--color-primary`).
3. Form inputs have associated `<label>` elements — never placeholder-only.
4. Error messages linked to fields via `aria-describedby`.
5. Status conveyed through text + color (never color alone).
6. Touch targets minimum 44×44px on mobile.
7. `prefers-reduced-motion` respected — animations disabled.
8. Semantic HTML (`<main>`, `<nav>`, `<aside>`, `<button>`) used throughout.
9. Dialogs trap focus and support Escape-to-close.
10. Screen readers receive meaningful ARIA labels for dynamic content.
