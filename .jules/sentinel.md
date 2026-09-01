## 2026-06-19 - Prevent Timing Attacks in Signature Verification
**Vulnerability:** Standard equality operators (`===` and `!==`) were used to verify Razorpay webhook and order signatures, making them vulnerable to timing attacks.
**Learning:** Node.js standard equality checks short-circuit on the first mismatched character, allowing an attacker to deduce the expected signature byte-by-byte by measuring response times.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from` for comparing sensitive tokens and signatures. Ensure buffer lengths match before comparison to avoid runtime errors, and cast inputs to strings to prevent TypeErrors on null/undefined.
