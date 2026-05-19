## 2024-05-24 - Overly Permissive CORS Vercel Wildcards
**Vulnerability:** API routes accepting any origin that ends with `.vercel.app` (`origin.endsWith('.vercel.app')`).
**Learning:** Vercel domains are public and can be created by anyone. Accepting `*.vercel.app` allows any unauthorized Vercel deployment to bypass CORS and make cross-origin requests to sensitive endpoints (e.g. creating Razorpay orders).
**Prevention:** Instead of wildcard Vercel matching, only allow explicitly trusted domains or use environment-specific URLs (like `NEXT_PUBLIC_APP_URL`) in API routes.
