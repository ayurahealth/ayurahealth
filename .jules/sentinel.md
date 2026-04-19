## 2024-05-24 - [Timing Attack Vulnerability in Webhook Signature Verification]
**Vulnerability:** The Razorpay webhook signature verification in `app/api/webhooks/razorpay/route.ts` used a standard string comparison (`!==`) which is vulnerable to timing attacks.
**Learning:** This vulnerability existed because standard equality operators do not compare strings in constant time, allowing attackers to infer the expected signature byte by byte based on response times.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from` and ensure buffer lengths match before comparison when verifying sensitive signatures, tokens, or passwords.
