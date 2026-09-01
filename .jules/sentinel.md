## 2026-06-13 - [Payment Signature Timing Attack]
**Vulnerability:** Comparing webhook and payment signatures using simple string equality.
**Learning:** String equality operators exit early on the first mismatched character, allowing attackers to incrementally guess signatures via timing side-channels.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from` for constant-time comparison of sensitive tokens and signatures.
