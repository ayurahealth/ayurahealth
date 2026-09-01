
## 2024-05-18 - Fix timing attack in signature verification
**Vulnerability:** Timing attack vulnerability in webhook and payment signature verification caused by using standard string comparison (`===` and `!==`).
**Learning:** Standard string comparisons stop at the first differing character, leaking the length of the matching prefix through execution time. This allows an attacker to iteratively guess a valid HMAC signature character by character.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from` for comparing sensitive tokens, HMAC signatures, or passwords in Node.js to ensure constant-time comparison. Make sure to check that the buffer lengths are equal before calling `crypto.timingSafeEqual` to avoid throwing errors.
