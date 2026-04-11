# AyuraHealth: Production Readiness Checklist

This document outlines the critical steps and configurations required to transition AyuraHealth from development to a high-scale production environment.

## 1. Security & Identity
- [ ] **Row Level Security (RLS)**: Ensure all tables in Supabase have RLS enabled. Users should only be able to read/write their own profiles and chat sessions.
- [ ] **Clerk Webhooks**: Verify that `user.created` webhooks are securely handled with signature verification (Svix).
- [ ] **API Secrets**: Ensure `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, and `RAZORPAY_KEY_SECRET` are stored in Vercel Environment Variables (never committed).

## 2. Infrastructure & Performance
- [ ] **Database Caching**: Implement Vercel KV or Upstash Redis for chat sessions and rate-limiting to reduce Prisma/Supabase load.
- [ ] **Edge Runtime**: Evaluate moving critical API routes to the Edge Runtime for lower latency in India/Japan.
- [ ] **RAG Optimization**: Monitor vector search latency. Consider a dedicated vector DB (e.g., Pinecone or Supabase pgvector with HNSW index) if knowledge base exceeds 10,000 chunks.

## 3. Launch & Marketing
- [ ] **SEO Metadata**: Finalize `title`, `description`, and `og:image` for all pages.
- [ ] **Analytics**: Verify Vercel Analytics and Google Tag Manager are firing.
- [ ] **Ad Pixel**: Install Meta Pixel for the planned FB/IG ad campaigns.

## 4. Stability & Monitoring
- [ ] **Sentry**: Integrate Sentry for real-time error tracking and performance monitoring.
- [ ] **Log Ingestion**: Set up Axiom or BetterStack for structured logging of AI reasoning traces.
- [ ] **Rate Limiting**: Currently in-memory. **MANDATORY**: Switch to `@upstash/ratelimit` before public ad launch.

---
*Created by Antigravity AI @ 2026-04-07*
