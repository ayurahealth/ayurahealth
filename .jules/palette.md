## 2024-05-31 - Improved Interactive Component Accessibility
**Learning:** Found multiple custom functional icon-buttons (in chat interfaces, audio toggles, and system selections) missing essential a11y properties (`aria-label`, `title`), leaving screen reader users and those seeking visual tooltips without context.
**Action:** Consistently added dynamic `aria-label` and `title` properties reflecting component state to enhance accessibility and user clarity without disrupting layout.
