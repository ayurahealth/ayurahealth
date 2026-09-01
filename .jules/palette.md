## 2024-05-18 - Missing ARIA labels in ChatComposer
**Learning:** Found several icon-only buttons in the `ChatComposer.tsx` component (like attachment remove, attach file, trace link, voice input) and in `dashboard-content.tsx` (like close modal) that lack `aria-label` and `title` attributes, making them inaccessible to screen readers and missing helpful tooltips.
**Action:** Always add `aria-label` and `title` to icon-only buttons to ensure they are accessible and provide clear tooltips.
