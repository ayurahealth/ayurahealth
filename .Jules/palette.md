## 2024-08-29 - Icon-Only Button Clarity
**Learning:** Icon-only action buttons in complex interaction components (like ChatComposer) often lack both screen reader context (`aria-label`) and visual hover context (`title`), leaving assistive tech users and sighted users guessing their specific functions (e.g., distinguishing between link attachment vs file attachment).
**Action:** Consistently pair `aria-label` with `title` on all icon-only buttons to ensure functional clarity for all users simultaneously.
