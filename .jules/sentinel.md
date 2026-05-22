## 2024-05-24 - Timing Attacks in Signature Verification
**Vulnerability:** Insecure string comparison (`===` and `!==`) was being used for HMAC signature verification in Razorpay webhooks and order creation endpoints.
**Learning:** String equality operators in JavaScript return false as soon as they find a character mismatch. This allows attackers to guess signatures byte-by-byte by measuring the time it takes the server to respond (a timing attack).
**Prevention:** Always use `crypto.timingSafeEqual` with matching length buffers (`Buffer.from()`) when comparing secure hashes, HMAC signatures, or secrets.
