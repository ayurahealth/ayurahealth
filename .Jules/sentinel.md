## 2024-05-24 - Timing Attacks in Authentication Bypasses
**Vulnerability:** Timing attacks on hardcoded bypass keys (`CEO_BYPASS_KEY`) using standard string comparison (`===` and `!==`).
**Learning:** Even internal or admin-only bypass mechanisms must be protected against side-channel attacks. Attackers can deduce keys character-by-character by measuring the server's response time to slightly incorrect keys.
**Prevention:** Always use `crypto.timingSafeEqual` to compare secrets. Ensure lengths are explicitly checked beforehand (`buf1.length === buf2.length`), as `timingSafeEqual` will throw an error if lengths differ, which can lead to application crashes or error leakage.
