## 2024-05-24 - Fixed Timing Attack in Payment Validation
**Vulnerability:** The Razorpay payment signature was being compared using a standard equality check `===`, leaving it vulnerable to timing attacks.
**Learning:** String equality operators (`===`) leak the time taken to evaluate matches, allowing an attacker to iteratively guess a valid cryptographic signature.
**Prevention:** When verifying any secret, token, or HMAC signature, always use constant-time comparisons (`crypto.timingSafeEqual`) after verifying buffer lengths to protect against timing attacks.
