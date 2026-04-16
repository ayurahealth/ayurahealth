## 2024-05-19 - Accessible Icon Buttons in ChatComposer
**Learning:** Found that icon-only buttons in complex, heavily interactive components like `ChatComposer` were missing accessibility attributes. The buttons solely relying on icons (e.g., Lucide React icons) for meaning were inaccessible to screen readers.
**Action:** Always verify that interactive icon-only elements contain explicit `aria-label` and `title` attributes (e.g., `aria-label="Send message"`), particularly in core UI components like composer inputs.
