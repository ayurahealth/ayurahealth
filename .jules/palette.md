## 2026-09-11 - Add ARIA Labels to ChatComposer
**Learning:** Icon-only buttons in complex toolbars (like ChatComposer) often miss `aria-label`s, rendering them inaccessible to screen readers. This pattern is common in interactive, highly visual applications.
**Action:** Always verify that icon-only buttons (`<button><Icon /></button>`) have descriptive `aria-label` attributes, especially in shared or prominent components like chat input areas.
