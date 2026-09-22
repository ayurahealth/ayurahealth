## 2026-09-22 - Missing ARIA labels in composer toolbar
**Learning:** In complex interactive components like `ChatComposer`, icon-only buttons for core features (attach, voice, send) are frequently added without explicit `aria-label` or `title` attributes. This renders essential application functionality completely inaccessible to screen reader users and reduces discoverability.
**Action:** Always ensure icon-only buttons across the app contain descriptive `aria-label` and `title` attributes, particularly in high-traffic toolbars.
