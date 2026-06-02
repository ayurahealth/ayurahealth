## 2024-06-02 - Fix timing attack vulnerabilities in signature verifications
**Vulnerability:** Razorpay webhook and create-order endpoints used standard string equality (`===` and `!==`) to verify HMAC signatures (`expectedSignature === razorpay_signature`), which is vulnerable to timing attacks.
**Learning:** Checking string equality character by character exposes the length of the matching prefix through timing differences, enabling an attacker to forge a valid signature over time.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from` to compare security-sensitive tokens, passwords, and signatures. Ensure the buffers are of the same length to prevent `TypeError` exceptions.
