## 2025-02-24 - Accessibility pattern for icon-only buttons
**Learning:** Found multiple icon-only buttons without `aria-label`s in the application. They were often wrapped in `div` elements and styled, but lacked crucial screen reader support, especially in interactive chat components like VoiceOutput and VoiceInput, as well as file upload interfaces.
**Action:** When creating or modifying icon-only buttons, always add descriptive `aria-label` attributes. If the button has dynamic states (e.g., 'Stop' vs 'Listen'), the `aria-label` should reflect the current actionable state.
