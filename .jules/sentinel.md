## 2026-06-22 - Prevent Timing Attacks in Razorpay Webhook Verification
**Vulnerability:** The Razorpay webhook signature verification used a standard equality operator (`===`) instead of a constant-time comparison, making it susceptible to timing attacks.
**Learning:** Standard equality operators short-circuit upon finding the first mismatched character, leaking information about the expected signature's contents through response time variations.
**Prevention:** Always use `crypto.timingSafeEqual()` with length-checked `Buffer.from()` conversions when comparing sensitive tokens, hashes, or signatures in Node.js to ensure constant-time comparison.
