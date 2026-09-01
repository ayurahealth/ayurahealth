## 2026-06-10 - Dynamic Icon-Only Buttons Require Dynamic Labels
**Learning:** The application's chat and voice interface contains a pattern of dynamic icon-only buttons (e.g., play/stop, mic on/off) that lack dynamic ARIA labels and titles, preventing screen readers from understanding state changes.
**Action:** Always include both `aria-label` and `title` attributes on all icon-only buttons throughout the design system, and dynamically update them using state variables (e.g., `isListening`, `isPlaying`) to accurately reflect the button's current action.
