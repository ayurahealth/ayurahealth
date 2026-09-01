## 2026-06-23 - Timing Attacks & Predictable RNG
**Vulnerability:** Found predictable transaction IDs using Math.random() and timing attack vulnerability in HMAC signature verification (using ===).
**Learning:** Financial identifiers need CSPRNG, and signature verification requires constant-time comparison to prevent side-channel timing attacks.
**Prevention:** Always use crypto.randomUUID() for sensitive IDs and crypto.timingSafeEqual with Buffer.from for secret token comparison.
