## 2026-05-30 - Dynamic Aria Labels for Icon-Only Stateful Toggles
**Learning:** Icon-only stateful toggles (like voice recording or playback) in this specific chat interface require dynamic state-driven descriptions because the icon change alone (e.g., Mic to Square) is insufficient for screen readers and lacks visual tooltip context for sighted users.
**Action:** Always implement a paired, dynamic `aria-label` and `title` combination tied to the component's state for all icon-only interactive elements in the design system.
