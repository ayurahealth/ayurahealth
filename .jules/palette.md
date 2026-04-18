## 2024-04-18 - First entry
**Learning:** Initializing palette journal.
**Action:** Always document critical learnings here.
## 2024-04-18 - Missing ARIA Labels on Icon-Only Inputs
**Learning:** Icon-only inputs in Chat UIs like attachment, link, voice, and send buttons often lack `aria-label` and `title` attributes. This breaks accessibility for screen reader users and affects standard usability since the meaning of these buttons can be ambiguous.
**Action:** When auditing Next.js apps with custom chat interfaces, always check input toolbars for missing `aria-label` and `title` attributes on interactive icon-only elements. Ensure they clearly describe their function.
