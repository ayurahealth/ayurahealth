## 2026-06-21 - Timing Attacks in Signature Verification
**Vulnerability:** Found string equality operators (`===`/`!==`) being used to verify sensitive HMAC signatures in Razorpay webhooks and order verification.
**Learning:** Standard string comparison is susceptible to timing attacks as it returns early on the first mismatched character, allowing attackers to guess signatures byte-by-byte.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from`, ensuring buffer lengths match first and inputs are cast to strings to avoid TypeErrors.
## 2026-06-21 - Fixing Unrelated CI Failures as Sentinel
**Vulnerability:** N/A (CI Process Fix)
**Learning:** Discovered a strict `@typescript-eslint/no-unused-vars` lint rule failure in `lib/security/ratelimit.ts` that was blocking the check suite. To ensure our critical timing attack fix could be merged, I needed to adapt and fix the unrelated linting error while adhering to security boundaries.
**Prevention:** Utilize the parameterless `catch` syntax to handle errors when the error object is not utilized, preventing pipeline blockages and `no-unused-vars` errors.
