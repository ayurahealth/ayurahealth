## 2026-05-26 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** The application has a recurring pattern where icon-only buttons lack screen-reader accessible `aria-label` attributes, though some have visual `title` tooltips. This is particularly prevalent in dynamic interactive components like the Chat Composer and Voice modules.
**Action:** Always include both `title` (for tooltips) and `aria-label` (for screen readers) on icon-only buttons, ensuring they dynamically update to reflect the current state (e.g., Start/Stop listening).
