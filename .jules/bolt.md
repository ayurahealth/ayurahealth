## 2025-02-18 - Optimized React Markdown rendering
**Learning:** `ClinicalMarkdown.tsx` recreated its component overrides (e.g. `h1`, `h2`, `h3`, etc.) dynamically on every render pass. By extracting the component overrides to a static object outside the component and wrapping the markdown processor with `React.memo`, we can prevent unnecessary rendering cycles on deeply nested complex markdown trees.
**Action:** Extract large functional component overrides outside of rendering cycles to prevent object reallocation and use `React.memo` to guard against redundant diffing.
