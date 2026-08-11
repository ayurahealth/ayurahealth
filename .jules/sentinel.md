## 2024-05-24 - Authorization Bypass Backdoor
**Vulnerability:** A "CEO bypass" backdoor was found that allowed anyone with the CEO_BYPASS_KEY and ayura_ceo_token cookie to bypass authentication and rate limits.
**Learning:** Backdoors should never be left in production code, even for administrators, as they create a severe security risk if the secret key is leaked.
**Prevention:** Avoid implementing custom bypass logic; use standard authentication and authorization mechanisms with appropriate role-based access control.
