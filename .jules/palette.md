## 2024-03-22 - Missing ARIA Labels in Chat Composer
**Learning:** Found multiple icon-only buttons (remove attachment, toggle link, upload file, microphone, and send) in `ChatComposer.tsx` that lack ARIA labels, making them inaccessible to screen readers. This is a common pattern in complex interactive components where visual space is limited.
**Action:** Always ensure that icon-only interactive elements have descriptive `aria-label` attributes to maintain accessibility without compromising visual design.
