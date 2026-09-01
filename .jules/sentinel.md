## 2026-04-29 - Fixed Timing Attack in Razorpay Webhooks
**Vulnerability:** Razorpay webhook and order signatures were being compared using standard string equality (`===`).
**Learning:** This exposes the verification endpoints to observable timing discrepancies, allowing attackers to potentially forge payment success events over time.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from(String(val))` and length checks to prevent TypeErrors and ensure constant-time comparison for all HMAC signatures.
