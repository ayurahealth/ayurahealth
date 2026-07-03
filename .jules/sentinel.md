## 2026-07-03 - Hardcoded Admin Backdoors
**Vulnerability:** A hardcoded CEO_BYPASS_KEY in the codebase allowed anyone with the key to bypass authentication and rate limits.
**Learning:** Hardcoded access keys are easily leaked and bypass standard RBAC, creating severe security risks.
**Prevention:** Never use hardcoded tokens or bypass keys; always rely on standard authentication and Role-Based Access Control (RBAC).
