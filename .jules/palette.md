## 2024-11-09 - [Accessible Form Loading States]
**Learning:** Loading states on actionable forms can lack clear context for screen readers when button text changes dynamically. Visual spinners improve immediate user feedback without confusing screen readers when combined with accessible attributes.
**Action:** Always combine animated visual indicators (like `Loader2`) with standard ARIA attributes (`aria-hidden="true"`) to maintain semantic clarity on changing interactive elements.
