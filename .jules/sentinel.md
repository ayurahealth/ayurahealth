## 2024-05-24 - Unauthorized Backdoor (CEO Bypass)
**Vulnerability:** A hardcoded authentication backdoor (CEO_BYPASS_KEY) was present, allowing complete bypass of Clerk authentication, rate limiting, and paywalls using a static secret.
**Learning:** Hardcoded bypass keys undermine the entire security architecture and authorization models, providing a single point of catastrophic failure if leaked.
**Prevention:** Remove all static bypass keys. Rely exclusively on role-based access control (RBAC) integrated into the primary authentication provider (e.g., Clerk user metadata).
