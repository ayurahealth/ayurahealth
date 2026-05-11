## 2026-05-11 - Fix Timing Attacks in Razorpay Signatures
**Vulnerability:** Razorpay HMAC signatures were being verified using standard string equality (`===` and `!==`), which leaks information about the correct signature byte-by-byte via timing differences.
**Learning:** Node.js API endpoints handling cryptographic signatures require constant-time comparisons, and standard string equality is optimized to fail fast, enabling timing attacks.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from(String(...))` for verifying sensitive tokens, secrets, or signatures, ensuring buffer lengths are compared first to prevent fatal crashes.
