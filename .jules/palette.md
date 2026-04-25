## 2026-04-25 - [Accessibility] Added ARIA labels to chat composer icon buttons
**Learning:** Icon-only buttons within interactive components (like a chat composer) often lack `aria-label` and `title` attributes, making them inaccessible to screen readers and confusing for mouse users.
**Action:** When auditing or building new interactive UI components (especially chat interfaces or forms), always verify that icon-only buttons have descriptive `aria-label` and `title` attributes (e.g., "Attach file", "Send message").
