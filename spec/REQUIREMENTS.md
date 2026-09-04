# Ayura Intelligence — Requirements

## Functional Requirements

### FR-1: VAIDYA Chat Engine
- **FR-1.1** Users can send health queries and receive streaming AI responses
- **FR-1.2** Responses must reference at least one classical medical tradition
- **FR-1.3** System supports 8 medical systems: Ayurveda, TCM, Tibetan (Sowa Rigpa), Unani, Siddha, Homeopathy, Naturopathy, Western Functional
- **FR-1.4** Chat sessions are persisted per authenticated user
- **FR-1.5** Guest users can chat up to FREE_MESSAGE_LIMIT without authentication

### FR-2: Dosha Profiling
- **FR-2.1** Users complete a clinical intake quiz (5 minutes)
- **FR-2.2** System computes Vata/Pitta/Kapha scores
- **FR-2.3** Dosha profile personalizes all subsequent AI responses
- **FR-2.4** Profile stored in UserProfile table via Prisma

### FR-3: Clinical Memory
- **FR-3.1** System extracts key health facts from chat history
- **FR-3.2** Memories stored as vector embeddings (pgvector, 384-dim)
- **FR-3.3** Relevant memories injected into system prompt context
- **FR-3.4** Users can view and clear their clinical memory

### FR-4: Authentication
- **FR-4.1** Clerk-powered sign-in (email, Google, Apple)
- **FR-4.2** Protected routes: /dashboard, /profile, /settings
- **FR-4.3** Middleware guards all protected paths at edge
- **FR-4.4** Unauthenticated users gracefully downgraded (not crashed)

### FR-5: Billing
- **FR-5.1** Razorpay subscription plans (Free, Pro, Clinic)
- **FR-5.2** Webhook-validated payment events
- **FR-5.3** User tier stored in Clerk publicMetadata
- **FR-5.4** Paywall enforced server-side in /api/chat

### FR-6: Multilingual
- **FR-6.1** Auto-detect user language from query
- **FR-6.2** Respond in same language as user
- **FR-6.3** Support Hindi, Japanese, Chinese, Korean, Arabic, Sanskrit

## Non-Functional Requirements

### NFR-1: Performance
- First token latency < 1.5s (Groq provider)
- Full response < 8s for typical query
- Vercel Edge Functions for middleware
- Prisma connection pooling via pg adapter

### NFR-2: Reliability
- LLM fallback chain: Groq → OpenRouter → Ollama (local)
- Rate limiting: 10 req/min/IP (distributed via Upstash Redis)
- DB connection failure → graceful degradation (no crash)
- Middleware Clerk failure → redirect, not 500

### NFR-3: Security
- All secrets via Vercel environment variables only
- No secrets in source code or git history
- HMAC-SHA256 webhook signature verification
- Input validation via Zod on all API routes
- MAX_CONTENT_BYTES request size limit

### NFR-4: Observability
- Structured logging via `lib/logger.ts`
- Response quality scoring per conversation
- Health endpoint: /api/health
- Env check endpoint: /api/env-check (debug only)

### NFR-5: Deployability
- Zero-downtime deploys via Vercel
- Prisma schema migrations via `npx prisma migrate deploy`
- Build succeeds even if NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is absent
- TypeScript strict mode, zero type errors on push
