## 2025-02-28 - Icon Button Accessibility
**Learning:** Found that complex UI components like ChatComposer often rely on icon-only buttons (X, Paperclip, Link, Mic, Send) without ARIA labels, rendering them completely opaque to screen reader users despite having clear visual affordances for sighted users.
**Action:** Always verify icon-only buttons have descriptive `aria-label` attributes. When buttons have dynamic states (e.g., Start/Stop listening), ensure the `aria-label` updates dynamically to reflect the current actionable state.
