## 2024-05-18 - [Preventing Timing Attacks in Signature Verification]
**Vulnerability:** String comparison (e.g. `===`) was being used to verify HMAC signatures in Webhooks and payment verifications (`app/api/webhooks/razorpay/route.ts` and `app/api/razorpay/create-order/route.ts`), making the endpoints vulnerable to timing attacks.
**Learning:** Checking string equality character-by-character allows attackers to deduce the expected signature by measuring the time taken for the comparison to fail.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from` to compare sensitive tokens, signatures, or secrets. Ensure that the lengths of the two buffers are equal before calling `crypto.timingSafeEqual` to avoid errors.
