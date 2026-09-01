
## 2024-05-18 - Missing Accessibility Labels on Icon-Only Buttons
**Learning:** Found a pattern where interactive icon-only buttons (like those in `ChatComposer.tsx`) lacked `aria-label` and `title` attributes, making them inaccessible to screen readers and lacking tooltips for mouse users.
**Action:** Consistently apply `aria-label` and `title` to all icon-only buttons. For toggleable buttons (e.g., "Start/Stop voice input" or "Add/Close link input"), dynamically update the label/title text based on component state to accurately reflect the action the button will perform when clicked.
