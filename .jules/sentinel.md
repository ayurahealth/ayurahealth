## 2025-02-14 - Fix Razorpay route security
**Vulnerability:** Found an overly permissive CORS wildcard (`origin.endsWith('.vercel.app')`), weak Math.random() usage for transaction IDs, and an insecure `===` check for Razorpay webhooks vulnerable to timing attacks.
**Learning:** These existed due to copy-pasting common patterns without considering Edge deployment contexts, crypto boundaries, and constant-time execution requirements for HMAC verifications.
**Prevention:** Avoid generic Vercel wildcards for CORS, always use `crypto.randomUUID()` for unique security identifiers, and strictly use `crypto.timingSafeEqual` with `Buffer.from` after checking length equality for string-based signature validations.
