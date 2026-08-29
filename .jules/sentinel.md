## 2024-08-30 - SSRF Vulnerability in Link Fetcher
**Vulnerability:** The `/api/fetch-link` endpoint directly fetched user-provided URLs without validating the target hostname or protocol, enabling Server-Side Request Forgery (SSRF). Attackers could potentially access internal network resources or read local files.
**Learning:** The built-in Next.js/Node fetch API does not automatically prevent requests to private IP addresses or loopback interfaces, nor does it enforce strict protocols unless configured to do so. User inputs destined for outgoing network requests must always be actively validated.
**Prevention:** Implemented URL parsing to enforce strict HTTP/HTTPS protocols and added regex checks to block resolution of local domains (localhost) and private IPv4 ranges (RFC 1918).
