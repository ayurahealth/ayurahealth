## 2025-02-14 - SSRF Vulnerability in Link Fetcher
**Vulnerability:** The `/api/fetch-link` endpoint uses `fetch(url)` directly with user-provided URLs without protecting against Server-Side Request Forgery (SSRF) and DNS rebinding attacks.
**Learning:** Native `fetch` lacks built-in protections against querying internal network IPs (like `127.0.0.1` or `169.254.169.254`). Without SSRF protection, attackers can read internal data or access cloud metadata services.
**Prevention:** Always use a custom fetch implementation (like `fetchWithSSRFProtection`) that resolves the hostname to an IP, validates the IP against private network ranges, and directly connects to the safe IP to avoid DNS rebinding (TOCTOU).
