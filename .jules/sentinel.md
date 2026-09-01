## 2025-02-14 - Fix Timing Attacks in Crypto Signature Validation
**Vulnerability:** Node.js string equality operations (`===`, `!==`) evaluate character-by-character and return early, leaking the length of common prefixes. This allows attackers to forge HMAC signatures or passwords via timing attacks.
**Learning:** Comparing cryptographic tokens (like `signature` in Razorpay webhooks) using plain equality checks is insecure.
**Prevention:** Always convert the expected and actual tokens to Buffers (`Buffer.from()`), check their lengths to ensure they match (as `crypto.timingSafeEqual` will throw if lengths differ), and use `crypto.timingSafeEqual(expectedBuffer, signatureBuffer)` for constant-time comparison.
