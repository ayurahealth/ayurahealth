## 2024-08-08 - [Remove CEO_BYPASS_KEY]
**Vulnerability:** A hardcoded `CEO_BYPASS_KEY` backdoor was present in the application, allowing an attacker to bypass authentication and rate limits if the server key was compromised.
**Learning:** Hardcoded access keys are dangerous and bypass established role-based access controls.
**Prevention:** Always rely on standardized RBAC systems. Do not commit or introduce backdoor keys in the codebase.
