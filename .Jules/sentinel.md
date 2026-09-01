## 2024-03-29 - [Timing Attack Vulnerability in CEO Bypass]
**Vulnerability:** String equality (`===` / `!==`) was used to verify sensitive secrets like `CEO_BYPASS_KEY` instead of `crypto.timingSafeEqual`. This allows an attacker to discover the secret key via a timing attack because V8 string comparison returns early on the first mismatched character.
**Learning:** Even internal or admin-only "bypass" features must follow standard cryptographic verification practices. Any direct string comparison of secrets exposes the system to timing attacks.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from` after verifying both buffers have the same length when comparing secrets, passwords, or HMAC signatures.
