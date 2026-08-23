## 2023-10-24 - Missing ARIA Labels on Icon-only Buttons
**Learning:** Icon-only buttons without `aria-label` or `title` attributes are common in chat composers. Specifically, the ChatComposer component uses several such buttons (attach file, add link, voice input, send message, remove attachment). Without these labels, screen readers will likely announce these buttons unhelpfully (e.g., "button").
**Action:** Always add descriptive `aria-label` or `title` attributes to icon-only buttons to ensure they are properly announced by screen readers.
