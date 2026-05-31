## 2026-05-31 - Timing Attack in HMAC Verification
**Vulnerability:** Found insecure '===' string comparison for HMAC signatures in Razorpay webhooks and API routes.
**Learning:** In Node.js, string comparison operators leak timing information, allowing attackers to guess valid signatures character by character. This could lead to forged payments or webhooks.
**Prevention:** Always use 'crypto.timingSafeEqual' with 'Buffer.from' and explicit length checks when comparing sensitive tokens or hashes.
