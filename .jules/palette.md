## 2024-05-23 - Accessibility for Dynamic Icon-Only Components
**Learning:** In complex composers like ChatComposer, toggle buttons (e.g., link input, voice recording) need their `aria-label` and `title` to be dynamic based on the current component state to accurately reflect the action they will perform.
**Action:** Always verify if an icon-only button is a toggle and apply conditional rendering to its `aria-label` and `title` attributes (e.g., `aria-label={isActive ? "Stop" : "Start"}`).
