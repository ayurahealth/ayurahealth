## 2026-07-05 - Remove Administrative Backdoor
**Vulnerability:** Found a hardcoded administrative backdoor (CEO_BYPASS_KEY) that allowed bypassing rate limits and accessing AI credits.
**Learning:** Implementing bypass keys or backdoors via cookies instead of standard RBAC creates a severe privilege escalation risk if the key is leaked.
**Prevention:** Always rely on a standardized and secure Role-Based Access Control (RBAC) system for administrative features. Never use hardcoded bypass tokens.
