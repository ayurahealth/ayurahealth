## 2026-06-28 - [R3F Buffer Reallocation Bottleneck]
**Learning:** In @react-three/fiber, passing a new typed array (like `new Float32Array(...)`) inline to the `args` prop of `<bufferAttribute>` causes it to fail shallow comparison, triggering costly WebGL buffer reallocations on every render.
**Action:** Always fully memoize typed arrays and pass their stable references to `args` to ensure stable references and avoid unnecessary GPU overhead.
