## 2024-05-24 - SSRF Vulnerability in fetch-link route
**Vulnerability:** The `/api/fetch-link` endpoint directly uses `fetch(url)` with user-provided input, allowing SSRF (Server-Side Request Forgery) attacks where an attacker could request internal resources like `http://169.254.169.254` (cloud metadata) or `http://localhost:3000`.
**Learning:** Next.js API routes often need to fetch external data, but native `fetch` doesn't block private IPs.
**Prevention:** Implement a custom `fetchWithSSRFProtection` wrapper that resolves the hostname to an IP using `dns.lookup`, validates it's not a private IP, and connects securely.
