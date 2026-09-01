## 2024-05-24 - [Title]
**Vulnerability:** Weak Randomness in Razorpay Receipt ID
**Learning:** Found usage of Math.random().toString(36) to generate receipt ids. This could lead to predictable IDs and is not cryptographically secure. While not extremely critical for receipts, it's poor security practice. The codebase uses crypto.randomUUID() globally, which is safer and simpler than crypto.randomBytes() since the global is polyfilled in Edge Next.js runtime.
**Prevention:** Use global `crypto.randomUUID()` when random numbers or UUIDs are required. Ensure to verify against any imports as this causes failures.
