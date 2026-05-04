## 2024-05-04 - Icon-Only Accessibility in ChatComposer
**Learning:** Icon-only buttons without accessible labels in ChatComposer components not only degrade the screen reader experience but also cause confusion for visual users when there are no tooltips on complex inputs like the ones for sources or voice control.
**Action:** Always add both `aria-label` for screen reader accessibility and `title` for hover tooltips on icon-only interactive elements to serve both assistive technology users and sighted users.
