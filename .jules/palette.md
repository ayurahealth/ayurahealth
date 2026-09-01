## 2026-05-07 - Missing ARIA labels on icon-only buttons
**Learning:** I found a common accessibility issue pattern in the app's components, specifically in `ChatComposer.tsx`: interactive icon-only buttons often lacked descriptive text. This is a critical barrier for screen reader users and those relying on tooltips.
**Action:** Always ensure icon-only interactive elements (like buttons) include both `aria-label` (for screen readers) and `title` (for visual tooltips) attributes to maintain accessibility and usability for all users.
