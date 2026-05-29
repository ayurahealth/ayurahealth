## 2025-05-29 - Missing aria-labels on ChatComposer icon buttons
**Learning:** Icon-only buttons within `ChatComposer.tsx` (such as attachment remover, paperclip, link toggle, mic toggle, and send buttons) are missing `aria-label`s and `title` attributes, severely impacting screen reader accessibility and hiding functionality context from sighted users.
**Action:** Adding standard `aria-label`s and `title` tags on all icon-only buttons as a primary accessibility rule. For dynamic icon buttons (e.g., mic recording toggle), the aria-label and title must reflect current state dynamically.
