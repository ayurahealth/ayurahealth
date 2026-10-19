## 2026-10-19 - Fix IDOR in chat history
**Vulnerability:** IDOR in chat history endpoint.
**Learning:** Relying solely on client-provided IDs without validating against the authenticated session allows users to view other users' histories.
**Prevention:** Always validate client-provided IDs against the authenticated user ID.
