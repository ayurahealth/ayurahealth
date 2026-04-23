# Ayura Intelligence Lab: Institutional Production Readiness Checklist

This document outlines the critical steps and configurations required to transition Ayura Intelligence Lab from development to a high-scale institutional production environment at ayurahealth.com.

## 1. Security & Identity
- [ ] **Institutional CORS Whitelist**: Ensure `app/api/razorpay/create-order/route.ts` only allows https://ayurahealth.com.
- [ ] **Row Level Security (RLS)**: Ensure all tables in Supabase have RLS enabled. Users should only be able to read/write their own profiles and clinical sessions.
- [ ] **Clerk Webhooks**: Verify that `user.created` webhooks are securely handled with signature verification (Svix).
- [ ] **API Secrets**: Ensure `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, and `RAZORPAY_KEY_SECRET` are stored in Vercel Environment Variables.

## 2. Infrastructure & Performance
- [ ] **Database Caching**: Implement Upstash Redis for clinical sessions and rate-limiting to reduce Prisma/Supabase load.
- [ ] **Edge Runtime**: Evaluate moving critical API routes to the Edge Runtime for lower latency.
- [ ] **Clinical RAG Optimization**: Monitor vector search latency. Consider an HNSW index if the institutional knowledge base exceeds 10,000 chunks.

## 3. Institutional Launch
- [ ] **Domain Synchronization**: Verify `ayurahealth.com` is primary in Vercel.
- [ ] **SEO Metadata**: Finalize institutional `title`, `description`, and `og:image` for all pages.
- [ ] **Analytics**: Verify Vercel Analytics and LogRocket are firing.

## 5. Logic Resilience (Gold Build)
- [x] **Agent Orchestration Timeouts**: Ensure `withTimeout` is applied to all Planner/Researcher calls to prevent hung providers (implemented in `context-engine.ts`).
- [x] **Clinical Sanitizer**: Verify `sanitizeInput` is used in `api/chat` to block prompt injection and normalize whitespace.
- [x] **Fallback Intelligence**: Ensure the `Synthesizer` can operate if one agent fails (implemented).

## 6. iOS Native Parity
- [ ] **Safe Area Audit**: Verify bottom-sheet modals don't overlap the iOS home indicator.
- [ ] **Glassmorphism Consistency**: Ensure `.ios-glass-thin` uses `var(--surface-glass-bg)` for platform-wide theme syncing.

---
*Maintained by Ayura Intelligence Lab Team — Gold Progress Update April 2026*
