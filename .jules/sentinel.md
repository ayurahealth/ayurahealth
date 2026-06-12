## 2026-06-12 - Timing Attacks in Signature Verification
**Vulnerability:** Razorpay webhook signature verified with standard string equality operators.
**Learning:** Standard string comparisons stop at the first mismatching character, enabling attackers to guess the HMAC signature via timing variations (timing attack).
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from` (checking length match first) for all secret or token comparisons.
