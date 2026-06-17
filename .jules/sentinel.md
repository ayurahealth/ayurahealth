## 2026-06-17 - Secure Webhook Verification
**Vulnerability:** Timing attack via string comparison in Razorpay signature verification
**Learning:** Comparing cryptographic signatures using standard equality operators (`===` or `!==`) allows attackers to guess signatures byte-by-byte by observing response times. Next.js APIs require `crypto.timingSafeEqual` with `Buffer.from`.
**Prevention:** Always verify signatures using constant-time comparison methods, ensuring buffer lengths match before comparison.
