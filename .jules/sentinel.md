## 2026-07-11 - Remove CEO Bypass Backdoor
**Vulnerability:** A hardcoded authentication backdoor (CEO_BYPASS_KEY) allowed bypassing Clerk authentication and rate limits.
**Learning:** Hardcoded bypass keys undermine the entire security model and RBAC system. They often start as 'temporary' debugging tools but get left in production, presenting a critical risk.
**Prevention:** Never use hardcoded secrets to bypass authentication. Always rely on standardized RBAC systems for administrative access and use proper testing environments instead of production backdoors.
