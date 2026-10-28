# CivicFix Accessibility Guidelines
**Phase:** Day 2: UI/UX Design  
**Target Standard:** WCAG 2.2 Level AA

---

## 1. Color & Contrast

- All text on backgrounds meets **4.5:1 minimum contrast ratio** (normal text) and **3:1** (large text ≥18px bold or ≥24px regular).
- Status information conveyed through **color + text label + icon** — never color alone.
- Focus indicators use a **2px solid outline** in `--color-primary` (#176B5B) with 2px offset.
- UI elements (buttons, inputs, icons) meet **3:1 contrast** against adjacent colors.

## 2. Typography & Readability

- Minimum body text size: **14px** (web), **14sp** (Flutter).
- Minimum supporting text size: **12px** (web), **12sp** (Flutter).
- Line height minimum: **1.4** for body text.
- Maximum line length: **72 characters** for readability.
- Text resizable up to **200%** without horizontal scrolling on web portals.

## 3. Keyboard Navigation (Web Portals)

- All interactive elements reachable via **Tab key** in logical order.
- **Visible focus indicators** on every focusable element (no `outline: none` without replacement).
- **Enter/Space** activates buttons and links.
- **Escape** closes modals, dropdowns, and popovers.
- **Arrow keys** navigate within dropdown menus, tabs, and date pickers.
- Skip-to-content link provided as first focusable element.

## 4. Forms & Inputs

- Every input has a visible `<label>` element — placeholder text is supplementary, not a replacement.
- Required fields marked with visual indicator and `aria-required="true"`.
- Validation errors displayed inline below the field with `aria-describedby` association.
- Error messages are descriptive: "Password must be at least 8 characters" not "Invalid input."
- Form submission errors summarized at top of form with links to specific fields.

## 5. Screen Reader Support

- Semantic HTML5 elements: `<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, `<section>`.
- ARIA landmarks for dynamic content regions.
- `aria-live="polite"` for toast notifications and status updates.
- `aria-label` on icon-only buttons (e.g., close, menu toggle).
- Status badges include text that screen readers can interpret: `<span aria-label="Status: In Progress">`.
- Data tables use `<th scope="col">` for column headers.

## 6. Touch Accessibility (Mobile)

- Minimum touch target: **48×48dp** (Flutter) / **44×44px** (web).
- Adequate spacing between adjacent targets: minimum **8dp** gap.
- Swipe gestures supplemented with visible button alternatives.
- No time-critical interactions without user-configurable extension.

## 7. Motion & Animation

- **`prefers-reduced-motion: reduce`** media query respected in all CSS animations.
- Flutter: Check `MediaQuery.of(context).disableAnimations` before running transitions.
- Essential information never conveyed solely through animation.
- No auto-playing animations that cannot be paused.
- Transition durations: 150ms–300ms maximum.

## 8. Images & Media

- All meaningful images have descriptive `alt` text.
- Decorative images use `alt=""` or `aria-hidden="true"`.
- Photo uploads show filename and file size for assistive technology.
- Map components provide text-based location summary as fallback.

## 9. Dialogs & Modals

- Focus trapped within modal when open.
- Focus moves to modal on open; returns to trigger element on close.
- `aria-modal="true"` and `role="dialog"` with `aria-labelledby` pointing to title.
- Background content marked `aria-hidden="true"` and `inert` when modal is active.
- Close via Escape key, explicit close button, and (optionally) overlay click.

## 10. Testing Recommendations

Before claiming accessibility compliance:
1. **Automated scans**: Run axe-core or Lighthouse accessibility audit on every page.
2. **Keyboard walkthrough**: Navigate entire app without mouse.
3. **Screen reader testing**: Test with NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android).
4. **Zoom testing**: Verify usability at 200% browser zoom.
5. **Color contrast tool**: Verify all pairings with WebAIM contrast checker.
6. **Reduced motion**: Enable `prefers-reduced-motion` and verify no jarring animations.
