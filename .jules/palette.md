## 2026-06-19 - Added Accessibility Attributes to ChatComposer
**Learning:** Found multiple icon-only buttons in `ChatComposer.tsx` lacking `aria-label` and `title`. It's a common accessibility issue where developers use icons for layout aesthetics without considering screen reader context.
**Action:** Always verify icon-only buttons include explicit text equivalents (`aria-label`) and visual tooltips (`title`) when working on interactive UI elements.
