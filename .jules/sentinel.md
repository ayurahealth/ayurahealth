## 2026-09-14 - SSRF vulnerability in fetch-link route
**Vulnerability:** Found a Server-Side Request Forgery (SSRF) vulnerability in `app/api/fetch-link/route.ts` where user-provided URL is directly passed to `fetch` without validation against private IP addresses or internal hostnames.
**Learning:** This existed because the `url` from the request body was only checked if it was a string, but the hostname and IP were not validated to prevent accessing internal network resources (AWS metadata, localhost, etc.).
**Prevention:** Always parse user-provided URLs, validate the hostname against a whitelist or resolve the IP and check against private/internal IP blocks before making outbound requests using `fetch` or HTTP clients.
