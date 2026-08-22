## 2023-10-27 - Prevented API secret exposure in CEO bypass cookie
**Vulnerability:** The `CEO_BYPASS_KEY` from `process.env` was directly written into the client's `ayura_ceo_token` cookie, exposing the backend API secret to users.
**Learning:** Even securely transmitted (`HttpOnly`, `secure`) cookies expose their literal values to clients with physical or developer tool access. Using raw environment secrets as tokens leads to immediate credential leakage.
**Prevention:** Always hash (e.g., using SHA-256) or sign (JWT, HMAC) backend secrets before using them in cookies or any client-facing storage.
