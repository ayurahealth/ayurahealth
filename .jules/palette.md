## 2026-10-23 - Added missing ARIA labels to chat icon buttons
**Learning:** The application heavily utilizes icon-only buttons for various chat actions (attachments, voice, links). Without explicit ARIA labels, these buttons are opaque to screen readers, severely impacting accessibility for visually impaired users interacting with the AI.
**Action:** Always ensure that icon-only buttons and interactive elements have descriptive `aria-label` attributes that update dynamically based on the component's state (e.g., 'Start recording' vs 'Stop recording').
