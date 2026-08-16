## 2024-05-25 - WebGL Buffer Array Optimizations
**Learning:** When preparing flat coordinate arrays for WebGL buffers (like in `@react-three/fiber`), creating intermediate 3D objects (e.g., `new THREE.Vector3(...)`) inside iteration loops just to extract their components causes unnecessary memory allocation and garbage collection overhead.
**Action:** Push or spread primitive coordinate values directly into the array to minimize memory allocation and garbage collection overhead.
