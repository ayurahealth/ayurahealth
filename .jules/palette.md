## 2024-05-18 - [Icon-only buttons missing ARIA labels]
**Learning:** Found several icon-only buttons in `components/chat/ChatComposer.tsx` (Attach file, Link, Voice input) lacking `aria-label` or `title` attributes, making them inaccessible to screen readers.
**Action:** Always verify icon-only buttons have descriptive `aria-label`s so screen reader users understand their function.
