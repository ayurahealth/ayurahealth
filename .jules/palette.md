## 2024-05-24 - [Icon-Only Button Accessibility Pattern]
**Learning:** Discovered a pattern where rich interactive components (like ChatComposer) often rely heavily on icon-only buttons for actions like attachments, voice input, and sending messages without providing aria-labels, making the interface completely opaque to screen readers despite visual clarity.
**Action:** Always ensure that icon-only buttons receive descriptive aria-labels, especially in complex inputs where context isn't implicitly obvious to assistive tech.
