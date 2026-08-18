## 2024-05-24 - Unnecessary 3D Renders on Hover
**Learning:** In react-three-fiber, updating state (like hovered item) in a parent component causes all child 3D nodes to re-render, which can significantly drop framerates in WebGL.
**Action:** Always wrap static or semi-static 3D objects in `React.memo` if their parent handles high-frequency state updates like hover or selection.
