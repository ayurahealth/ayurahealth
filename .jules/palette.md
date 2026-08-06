## 2024-05-24 - Dynamic Accessibility Pattern
**Learning:** Found that dynamic toggle buttons in this codebase (like voice recording or attachment inputs) need their accessibility attributes (`aria-label`, `title`, `aria-pressed`) strictly synced with state variables (e.g., `isListening`, `showLinkInput`) rather than static text, to ensure screen readers accurately announce their current action mode.
**Action:** Always bind `aria-label` and `aria-pressed` to state variables for toggle-style components in this application to ensure correct context.
