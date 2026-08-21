## 2024-05-23 - Critical SSRF in Fetch Endpoint
**Vulnerability:** The `/api/fetch-link` endpoint performed a server-side fetch on a user-provided URL without any protocol or hostname validation, allowing SSRF (Server-Side Request Forgery) attacks.
**Learning:** Even simple utility endpoints (like fetching website titles) are major security risks if they accept unvalidated remote URLs, as they can be weaponized to scan internal network architectures or read cloud metadata.
**Prevention:** Always parse and validate user-supplied URLs to restrict protocols strictly to HTTP/HTTPS and explicitly block resolution to `localhost` and private IP ranges before passing them to server-side fetch calls.
