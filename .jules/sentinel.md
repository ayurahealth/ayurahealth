## 2025-01-21 - [Prevent Timing Attack in Webhook Verification]
**Vulnerability:** String comparison `!==` used for validating webhook signatures.
**Learning:** String comparison can be susceptible to timing attacks, allowing an attacker to deduce the signature byte by byte based on the response time.
**Prevention:** Use `crypto.timingSafeEqual` to ensure constant-time comparison, first validating lengths to avoid exceptions.
