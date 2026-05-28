## 2026-05-28 - Icon-only Buttons Accessibility
**Learning:** Identified a systemic pattern where icon-only buttons (especially in ChatComposer and voice components) lack `aria-label` and `title` attributes, severely impacting screen reader accessibility and visual discovery.
**Action:** Enforce the addition of both `aria-label` and `title` (with dynamic state updates for toggle buttons) on all icon-only interactive elements across the application.
