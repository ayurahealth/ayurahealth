## 2024-08-23 - WebGL Geometry Optimization
**Learning:** Found that a 128x128 segment `Sphere` used with `MeshDistortMaterial` in `WebGLBackground` was causing excessive vertex shader overhead (~16k vertices) without any visual benefit for a background liquid effect.
**Action:** Always check geometry segment counts on background elements; reduce them dramatically (e.g., to 64x64 or lower) if they are distorted or blurry, as the visual difference is imperceptible but the GPU savings are massive.
