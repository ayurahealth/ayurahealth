## 2023-10-27 - Icon-Only Button Accessibility Pattern
**Learning:** Found a recurring pattern in the app's components (ChatComposer, ClinicalHistory, Page) where icon-only buttons (using Lucide icons or basic text symbols like ✕) lacked `aria-label` attributes, making them inaccessible to screen readers.
**Action:** Added `aria-label` attributes to these buttons to provide descriptive accessible names. Next time, always ensure icon-only interactive elements have an explicit `aria-label` or visually hidden text.
