## 2024-08-18 - Missing ARIA labels on Icon-only Buttons
**Learning:** The application heavily relies on icon-only buttons (using Lucide icons) for primary interaction points like sending messages or attaching files, but lacks `aria-label` attributes, making the UI completely inaccessible to screen readers.
**Action:** Always add explicit `aria-label` (and `aria-pressed`/`aria-expanded` when managing state) and `title` attributes to any button that contains only graphical elements without text.
