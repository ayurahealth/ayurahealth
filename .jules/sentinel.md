## 2024-05-17 - Remove Hardcoded CEO Auth Bypass Backdoor
**Vulnerability:** A hardcoded authentication bypass mechanism (CEO_BYPASS_KEY and ayura_ceo_token) was present, allowing complete avoidance of rate limiting and auth barriers if the correct cookie was supplied.
**Learning:** Hardcoded access keys pose a massive security risk, violating least-privilege principles and serving as backdoors that bypass intended auth protocols, exposing all application data and features unmetered.
**Prevention:** Rely strictly on established Role-Based Access Control (RBAC) via the primary identity provider (e.g., Clerk) for any administrative access, and strictly prohibit arbitrary secret-based backdoors.
