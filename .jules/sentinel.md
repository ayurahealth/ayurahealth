## 2026-06-24 - Timing Attack Vulnerability in Webhook Signature Verification
**Vulnerability:** The Razorpay webhook signature was being compared using a standard equality operator (`!==`), which is vulnerable to timing attacks.
**Learning:** Standard string comparison operators fail fast upon encountering the first mismatched character. Attackers can exploit the time difference in response times to guess the correct signature character by character.
**Prevention:** Always use `crypto.timingSafeEqual` along with `Buffer.from(String(...))` and length checks for secure, constant-time comparison of secrets or signatures.
