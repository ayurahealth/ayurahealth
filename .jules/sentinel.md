## 2026-05-27 - Razorpay Cryptography Fix
**Vulnerability:** Predictable PRNG and timing attack risk in Razorpay webhook.
**Learning:** Math.random() and strict equality were used for security-critical logic.
**Prevention:** Always use crypto.randomUUID() and crypto.timingSafeEqual().
