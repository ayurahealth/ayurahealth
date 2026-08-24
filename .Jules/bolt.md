## 2024-05-24 - Stable References for R3F BufferAttributes
**Learning:** Passing a dynamically created instance like `new Float32Array(...)` within an inline array literal to a `@react-three/fiber` attribute forces the WebGL buffer to be completely rebuilt on every render (such as during simple hover state changes), even if the underlying data values are identical.
**Action:** Always pre-compute and fully memoize the final TypedArray instances before passing them to R3F geometries to avoid costly memory reallocation and attribute teardown on each interaction frame.
