## 2026-06-08 - Fix timing attack in payment webhook
**Vulnerability:** Timing attack vulnerability in webhook signature verification using strict equality `===`.
**Learning:** Webhook signature verification should use constant-time comparisons (`crypto.timingSafeEqual`) with length checks to prevent timing attacks and unhandled `TypeError` exceptions.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from` and check length before calling it when comparing sensitive hashes or signatures.
