# Ayura Intelligence Lab: Institutional Production Readiness Checklist

This document outlines the critical steps and configurations required to transition Ayura Intelligence Lab from development to a high-scale institutional production environment at ayura.ai.

## 1. Security & Identity
- [ ] **Institutional CORS Whitelist**: Ensure `app/api/razorpay/create-order/route.ts` only allows https://ayura.ai.
- [ ] **Row Level Security (RLS)**: Ensure all tables in Supabase have RLS enabled. Users should only be able to read/write their own profiles and clinical sessions.
- [ ] **Clerk Webhooks**: Verify that `user.created` webhooks are securely handled with signature verification (Svix).
- [ ] **API Secrets**: Ensure `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, and `RAZORPAY_KEY_SECRET` are stored in Vercel Environment Variables.

## 2. Infrastructure & Performance
- [ ] **Database Caching**: Implement Upstash Redis for clinical sessions and rate-limiting to reduce Prisma/Supabase load.
- [ ] **Edge Runtime**: Evaluate moving critical API routes to the Edge Runtime for lower latency.
- [ ] **Clinical RAG Optimization**: Monitor vector search latency. Consider an HNSW index if the institutional knowledge base exceeds 10,000 chunks.

## 3. Institutional Launch
- [ ] **Domain Synchronization**: Verify `ayura.ai` is primary in Vercel.
- [ ] **SEO Metadata**: Finalize institutional `title`, `description`, and `og:image` for all pages.
- [ ] **Analytics**: Verify Vercel Analytics and LogRocket are firing.

## 4. Stability & Monitoring
- [ ] **LogRocket**: Verify integration for real-time error tracking and performance monitoring.
- [ ] **Log Ingestion**: Set up structured logging for AI orchestration traces.
- [ ] **Institutional Rate Limiting**: Switch to `@upstash/ratelimit` before public deployment.

---
*Maintained by Ayura Intelligence Lab Team — April 2026*
