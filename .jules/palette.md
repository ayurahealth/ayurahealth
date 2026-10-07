## 2025-02-27 - Adding ARIA labels to chat composer icon-only buttons
**Learning:** Found several icon-only buttons in the chat composer (attach file, add link, start/stop voice recording, send message) lacking `aria-label` attributes. This is a common accessibility issue that prevents screen reader users from understanding button functions.
**Action:** When adding or reviewing icon-only interactive elements, always ensure an `aria-label` is present. For dynamic states (like start/stop recording), update the label dynamically based on state.
