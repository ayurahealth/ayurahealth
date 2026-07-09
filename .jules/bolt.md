## 2026-07-09 - [Optimize WebGL Buffer Allocation]
**Learning:** [In React Three Fiber, passing a new array reference like `new Float32Array(...)` inline to `args` of `<bufferAttribute>` causes costly WebGL buffer reallocations on every render. Also, creating intermediate `THREE.Vector3` objects during loops to extract coordinates creates unnecessary garbage collection overhead.]
**Action:** [Push primitive coordinate values directly into flat arrays and fully memoize the resulting `Float32Array` with `useMemo` before passing it to `<bufferAttribute>`.]
