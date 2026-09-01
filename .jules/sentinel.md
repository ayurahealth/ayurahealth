## 2026-06-07 - Timing Attack in Webhook Signature
**Vulnerability:** String equality (===) was used for Razorpay webhook signature verification.
**Learning:** This exposed the payment endpoint to timing attacks. Converting to buffers safely (handling null/undefined) and using crypto.timingSafeEqual is required.
**Prevention:** Always use constant-time comparison functions for sensitive tokens and webhook signatures.
