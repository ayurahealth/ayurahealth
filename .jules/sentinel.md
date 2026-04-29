
## 2024-05-28 - Insecure Razorpay Webhook Verification and Receipt Generation
**Vulnerability:** Found `Math.random()` being used to generate Razorpay receipt IDs, and standard strict equality (`===`) being used for HMAC signature comparison during payment webhook verification.
**Learning:** This is a dual vulnerability: predictability of receipt IDs via weak PRNG, and timing attacks on signature verification via string comparison short-circuiting.
**Prevention:** Always use cryptographically secure random number generators like `crypto.randomBytes` for sensitive identifiers, and use `crypto.timingSafeEqual` with defensively padded buffers wrapped in `try-catch` blocks for comparing security signatures.
