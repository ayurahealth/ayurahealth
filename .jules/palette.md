## 2024-10-01 - Icon-only buttons lacking ARIA labels
**Learning:** Generic action buttons (like chat input controls, modal closures) using only icons are completely opaque to screen reader users without `aria-label`s, breaking the accessibility of core interactive components.
**Action:** Always verify that buttons containing only icons (like `<X />`, `<Paperclip />`, `<Mic />`) have descriptive `aria-label` attributes to ensure they are perceivable to all users.
