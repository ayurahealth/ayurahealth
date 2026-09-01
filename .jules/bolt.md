## 2024-08-09 - Object Allocation Inside Mapping Loops
**Learning:** Creating intermediate `THREE.Vector3` objects inside nested loops just to extract their components via the spread operator significantly increases memory allocation overhead and creates unnecessary work for the garbage collector.
**Action:** When preparing coordinate arrays for WebGL buffers from data that already exists as an array of primitives, push or spread the primitive values directly into a standard array to minimize intermediate object creation before feeding them into Float32Array.
