## 2024-05-24 - Removed CEO Bypass Backdoor
**Vulnerability:** A hardcoded `CEO_BYPASS_KEY` backdoor was present, allowing unrestricted access and bypassing of authentication, rate limiting, and payment controls.
**Learning:** Hardcoded bypass keys (even for admins or CEOs) create severe security vulnerabilities if the key is leaked, as they grant unrestricted access and bypass all security controls.
**Prevention:** Always rely on a standardized and secure Role-Based Access Control (RBAC) system for administrative access rather than hardcoded environment variables and cookie bypasses.
