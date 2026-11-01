## 2026-11-01 - [SSRF vulnerability in fetch-link API]
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) vulnerability in the `app/api/fetch-link/route.ts` endpoint, allowing arbitrary external and internal HTTP requests via user-controlled URL.
**Learning:** Relying solely on `fetch(url)` without validating the host protocol or checking if it resolves to a private IP (e.g., loopback) creates SSRF risks. We must resolve the DNS to an IP and explicitly block local subnets to prevent DNS rebinding attacks.
**Prevention:** Always validate URL schemes, perform DNS resolution before fetching, and explicitly block local/private IP ranges (127.0.0.0/8, 10.0.0.0/8, etc.) for user-provided URLs.
