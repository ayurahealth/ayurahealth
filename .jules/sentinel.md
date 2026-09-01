## 2026-06-14 - Fix Timing Attacks & Insecure RNG
**Vulnerability:** Signature verification used standard equality operators (`===`) which is vulnerable to timing attacks. Also, Razorpay receipt IDs used predictable `Math.random()`.
**Learning:** In Node.js, standard string comparison terminates early on the first mismatched character, allowing attackers to guess hashes byte-by-byte by observing response times. `Math.random()` is not a CSPRNG and generates predictable values, which shouldn't be used for transaction identifiers.
**Prevention:** Always use `crypto.timingSafeEqual()` with identically sized `Buffer`s for comparing security hashes, secrets, or signatures. Ensure `crypto.randomUUID()` or `crypto.randomBytes()` is used for security-sensitive identifiers.
