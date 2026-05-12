
## 2026-05-12 - Fix Overly Permissive CORS and Insecure Signature Verification
**Vulnerability:** The `app/api/razorpay/create-order/route.ts` API route had an overly permissive CORS wildcard (`origin.endsWith('.vercel.app')`) and insecure string equality (`===`) for verifying Razorpay signatures.
**Learning:** The CORS wildcard could allow unauthorized Vercel deployments to perform CSRF attacks. The string equality check in signature verification made the endpoint susceptible to timing attacks.
**Prevention:** Restrict CORS allowed origins to specifically trusted domains or `NEXT_PUBLIC_APP_URL`. When comparing sensitive tokens/signatures in Node.js, always use `crypto.timingSafeEqual` with matched buffer lengths to ensure constant-time verification.
