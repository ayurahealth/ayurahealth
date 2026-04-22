## 2025-04-22 - Timing Attacks in Cryptographic Comparisons
**Vulnerability:** Comparing sensitive cryptographic hashes (like Razorpay webhook signatures) using the strict equality operator (`===` or `!==`) exposes the application to timing attacks, as the comparison fails early on the first mismatched character.
**Learning:** Node.js's `crypto.timingSafeEqual` should always be used for comparing sensitive tokens or hashes, ensuring constant-time comparison. The function requires arguments to be `Buffer` objects of the exact same length, so length checks must precede the comparison.
**Prevention:** Use `crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual))` after confirming `expected.length === actual.length` for all security-sensitive string comparisons.
