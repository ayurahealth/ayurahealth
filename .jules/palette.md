## 2026-06-05 - Dynamic ARIA Labels on Icon Buttons
**Learning:** Icon-only buttons with changing states (like play/stop) require dynamic ARIA labels and titles to remain accessible to screen readers throughout their lifecycle.
**Action:** Always bind `aria-label` and `title` to the same state variable controlling the icon to ensure the accessibility tree stays synchronized with visual updates.
