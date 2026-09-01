## 2024-11-26 - Icon-Only Button Accessibility Pattern
**Learning:** Found a recurring accessibility trap in the app's components (e.g., `dashboard-content.tsx`, `press-kit/page.tsx`) where icon-only interactive elements lack descriptive text, making them completely inaccessible to screen readers.
**Action:** Always ensure any interactive element (especially buttons) that relies solely on an icon includes an `aria-label` describing the action and a `title` attribute for visual hover context.
