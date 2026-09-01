## 2026-05-22 - Add ARIA Labels to Chat Composer Icons
**Learning:** The `ChatComposer` component uses icon-only buttons for actions like adding attachments and enabling voice synthesis, which lack `aria-label` attributes and native tooltips.
**Action:** Always include `aria-label` and `title` on icon-only interactive elements to ensure accessibility for screen readers and improve UX via tooltips.
