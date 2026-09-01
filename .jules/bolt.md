## 2024-08-12 - WebGL Buffer Array Allocation Overhead
**Learning:** Creating intermediate 3D objects (e.g., `new THREE.Vector3(...)`) inside iteration loops just to extract their components for WebGL buffers (like in `@react-three/fiber`) introduces significant memory allocation and garbage collection overhead.
**Action:** Push or spread primitive coordinate values directly into a flat array instead of mapping through intermediate 3D objects to minimize memory overhead.
