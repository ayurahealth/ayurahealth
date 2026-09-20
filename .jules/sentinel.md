## 2025-02-14 - Prevent Timing Attacks in HMAC Verification
**Vulnerability:** Found uses of strict equality (`===`) for comparing HMAC signatures in payment webhooks (`app/api/webhooks/razorpay/route.ts` and `app/api/razorpay/create-order/route.ts`).
**Learning:** Comparing HMACs using `===` exposes the application to timing attacks, where an attacker can determine the expected signature byte by byte based on the response time.
**Prevention:** Always use `crypto.timingSafeEqual` with proper length checks for comparing cryptographic hashes.
