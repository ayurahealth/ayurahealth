## 2025-02-12 - Missing ARIA Labels on Icon-only Close Buttons
**Learning:** Found an accessibility issue pattern specific to this app's components where custom modal close buttons (using "×" text or <X /> icons) lacked ARIA labels. This makes it impossible for screen reader users to understand the button's purpose when navigating dialogs.
**Action:** When implementing or reviewing custom modals, always ensure icon-only close buttons have explicit `aria-label` attributes like `aria-label="Close modal"` to support keyboard and screen reader accessibility.
