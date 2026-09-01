## 2026-07-30 - WebGL Buffer Attribute Optimization
**Learning:** In @react-three/fiber, passing a dynamically created typed array like `new Float32Array(...)` inline to `args` inside a `<bufferAttribute>` causes the WebGL buffer to reallocate on every render, and creating intermediate `THREE.Vector3` objects during iteration increases garbage collection overhead.
**Action:** Always fully build the flat coordinate array using primitive values inside a `useMemo` hook, instantiate the `Float32Array` once within the hook, and pass the stable memoized array reference to the `args` prop.
