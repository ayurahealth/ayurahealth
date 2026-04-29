## 2024-05-15 - Missing Accessibility Labels on Icon-Only Buttons
**Learning:** Highly interactive components across the app, such as `ChatComposer.tsx`, use many icon-only buttons (like paperclip, mic, link) but were completely missing screen reader support (`aria-label`) and visual tooltips (`title`). This lack of `aria-label` usage seems to be a recurring pattern in the repository.
**Action:** When working on UI components, specifically check for and add `aria-label` and `title` to all buttons that rely solely on icons to convey their function.
