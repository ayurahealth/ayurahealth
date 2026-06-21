## 2026-06-21 - Timing Attacks in Signature Verification
**Vulnerability:** Found string equality operators (`===`/`!==`) being used to verify sensitive HMAC signatures in Razorpay webhooks and order verification.
**Learning:** Standard string comparison is susceptible to timing attacks as it returns early on the first mismatched character, allowing attackers to guess signatures byte-by-byte.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from`, ensuring buffer lengths match first and inputs are cast to strings to avoid TypeErrors.
