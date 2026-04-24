## 2025-02-28 - [Critical] Timing Attack Vulnerability in Signature Verification
**Vulnerability:** Cryptographic signatures for Razorpay webhooks and payment validation were verified using standard string equality checks (`!==` or `===`).
**Learning:** Standard string comparisons stop at the first differing character, revealing how much of the string matched based on the comparison's execution time. This makes the system susceptible to timing attacks, allowing attackers to incrementally deduce the correct signature.
**Prevention:** Always convert sensitive comparison values to Buffers of equal length and compare them using `crypto.timingSafeEqual` to ensure constant-time execution, preventing timing attacks.
