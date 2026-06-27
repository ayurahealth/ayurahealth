## 2024-06-27 - [Hardcoded Administrative Backdoor]
**Vulnerability:** A hardcoded authentication bypass key (`CEO_BYPASS_KEY`) and an API route (`/api/auth/ceo-pass`) existed to allow unauthenticated admin access and bypass rate limiting.
**Learning:** Hardcoded backdoors (even if intended for internal/admin use) present a critical security vulnerability and should never be deployed. Relying on simple environment variables for authentication without a robust Role-Based Access Control (RBAC) system is insecure.
**Prevention:** Never implement hardcoded bypass keys or tokens. Always use standard, secure RBAC systems for administrative privileges.
