## 2024-10-24 - Remove hardcoded CEO backdoor
**Vulnerability:** A hardcoded token (`CEO_BYPASS_KEY`) allowed bypassing rate limits and accessing the system without proper authentication, posing a critical security risk.
**Learning:** Hardcoded backdoors, even for administrative or testing purposes, can easily be exploited if leaked, bypassing established security controls like Clerk.
**Prevention:** Rely strictly on established, robust Role-Based Access Control (RBAC) mechanisms for administrative access instead of ad-hoc tokens or bypass keys.
