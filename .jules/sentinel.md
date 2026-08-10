## 2024-08-10 - Removed CEO Bypass Vulnerability
**Vulnerability:** A backdoor authentication bypass logic (`ayura_ceo_token`) based on a server secret `CEO_BYPASS_KEY` was found. It allowed complete bypass of rate-limits.
**Learning:** Hardcoded overrides intended for "CEO" or "Admin" access through cookies provide severe authorization risks when not routed through proper IdP (Clerk).
**Prevention:** Ensure all authentication overrides and test logic are completely stripped from production code and solely manage roles via established providers (e.g. Clerk).
