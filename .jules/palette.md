## 2024-11-20 - Adding ARIA attributes to icon-only buttons
**Learning:** For accessibility and improved UX, icon-only buttons throughout the design system require both `aria-label` (for screen readers) and `title` (for tooltips) attributes. Modifying deep, complex components like `ChatComposer.tsx` can significantly improve the UX of core flows.
**Action:** Always include both `aria-label` and `title` attributes on all icon-only buttons to ensure they are accessible and intuitive for all users.
