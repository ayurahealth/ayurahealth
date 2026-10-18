## 2024-10-18 - Dynamic ARIA labels for Chat Composer
**Learning:** Found missing aria labels on dynamic toggle buttons (like start/stop listening). Implementing them requires state-dependent labels (e.g., 'Stop listening' vs 'Start listening') to accurately describe the actionable state to screen readers.
**Action:** Always ensure aria-label updates dynamically based on state when creating toggle buttons.
