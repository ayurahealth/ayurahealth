## 2026-05-03 - Adding Accessible Labels to Icon-only Action Buttons
**Learning:** Adding ARIA labels to dynamically changing buttons (like a microphone that changes from 'Start' to 'Stop') ensures screen readers accurately reflect the current actionable state, improving the overall chat composer UX without visually cluttering the UI.
**Action:** When creating or maintaining complex interactive elements like a chat composer, proactively ensure all icon-only buttons receive both `aria-label` for screen readers and `title` for hover tooltips to maintain universal accessibility.
