## 2024-08-28 - Missing ARIA Labels in ChatComposer
**Learning:** Found a recurring pattern in the chat UI where icon-only action buttons (attach, link, voice, send, and remove attachment) were lacking `aria-label` and `title` attributes, making them inaccessible to screen readers and lacking tooltip context.
**Action:** Next time, ensure all newly introduced icon-only buttons inherently include `aria-label` and `title` attributes for improved accessibility and clarity.
