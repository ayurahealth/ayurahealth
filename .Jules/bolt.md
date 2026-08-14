## 2025-02-14 - Optimize WebGL coordinate buffer generation
**Learning:** In `@react-three/fiber` scenes like `HolographicLabMap`, preparing coordinate arrays using intermediate `new THREE.Vector3()` objects inside render logic nested loops, then applying `flatMap` to extract coordinates, causes severe GC overhead.
**Action:** Always push primitive coordinate values directly into flat coordinate arrays for WebGL buffers instead of creating intermediate 3D objects to minimize memory allocation and garbage collection overhead.
