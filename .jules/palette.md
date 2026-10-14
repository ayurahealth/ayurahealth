
## 2026-10-14 - Dynamic ARIA labels for stateful icon buttons
**Learning:** Icon-only buttons that change state (e.g., 'Start' vs 'Stop') must have dynamic `aria-label` attributes that update to reflect the current actionable state for screen reader users.
**Action:** Always ensure `aria-label` attributes on stateful icon buttons are conditionally rendered based on the active state rather than using a static label.
