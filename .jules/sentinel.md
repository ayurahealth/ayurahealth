## 2026-09-17 - Mitigate Timing Attacks in Authentication Flow
**Vulnerability:** The bypass token check utilized a simple string comparison (`===`), rendering it vulnerable to timing attacks.
**Learning:** Standard string comparisons stop at the first mismatch, allowing attackers to incrementally guess valid secrets. Secure comparisons require constant time execution independent of content differences.
**Prevention:** Use `crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))` for all sensitive secret/token comparisons, strictly ensuring both buffers are the exact same length before comparing.
