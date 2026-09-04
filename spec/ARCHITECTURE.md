# Ayura Intelligence — System Architecture

## Overview

Ayura Intelligence is a **Next.js 15 App Router** application deployed on **Vercel** (Edge + Serverless Functions), backed by **Supabase PostgreSQL** with pgvector, and authenticated via **Clerk**.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│              CLIENT (Browser / iOS PWA)             │
│   Next.js React 19 · Framer Motion · Vanilla CSS   │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / SSE
┌──────────────────────▼──────────────────────────────┐
│           VERCEL EDGE (middleware.ts)               │
│   Dynamic Clerk Auth Guard · Route Protection       │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│        NEXT.JS SERVERLESS FUNCTIONS (API Routes)    │
│                                                     │
│  POST /api/chat ──► Context Engine ──► LLM Router  │
│  GET  /api/health   /api/env-check                  │
│  POST /api/webhooks/clerk  /api/webhooks/razorpay   │
└──────┬──────────────────────────┬───────────────────┘
       │                          │
┌──────▼──────────┐    ┌──────────▼──────────┐
│   SUPABASE DB   │    │   AI PROVIDERS       │
│  PostgreSQL     │    │  Groq (primary)      │
│  pgvector       │    │  OpenRouter (fb 1)   │
│  Prisma ORM     │    │  Ollama (fb 2 local) │
└─────────────────┘    └─────────────────────┘
       │
┌──────▼──────────┐
│  UPSTASH REDIS  │
│  Rate Limiting  │
└─────────────────┘
```

## Directory Structure

```
/
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── chat/             # VAIDYA chat endpoint (SSE streaming)
│   │   ├── health/           # System health check
│   │   ├── env-check/        # Environment diagnostics
│   │   ├── user-profile/     # User profile CRUD
│   │   ├── profile/sync/     # Clerk→DB profile sync
│   │   └── webhooks/         # Clerk + Razorpay webhooks
│   ├── chat/                 # Chat page UI
│   ├── dashboard/            # User health dashboard
│   ├── onboarding/           # Dosha intake quiz
│   ├── pricing/              # Subscription tiers
│   └── layout.tsx            # Root layout (ClerkWrapper, Analytics)
├── lib/
│   ├── ai/
│   │   ├── llm-router.ts     # Provider selection + fallback chain
│   │   ├── prompt-manager.ts # System prompt assembly
│   │   ├── embeddings.ts     # HuggingFace 384-dim embeddings
│   │   └── providers/        # Groq, OpenRouter, Ollama adapters
│   ├── context-engine.ts     # Clinical memory + knowledge retrieval
│   ├── prisma.ts             # Prisma client singleton
│   ├── healthChecks.ts       # System health validation
│   ├── rateLimit.ts          # Upstash Redis rate limiter
│   └── hooks/
│       └── useChat.ts        # React streaming SSE consumer
├── components/               # Shared UI components
├── prisma/schema.prisma      # DB schema
├── middleware.ts             # Edge auth guard (dynamic Clerk import)
├── scripts/                  # Build-time validation scripts
└── docs/                     # Operational and deployment guides
```

## Data Flow: Chat Request

```
1. User sends message → POST /api/chat
2. Rate limit check (Upstash Redis, 10 req/min/IP)
3. Clerk user resolution (optional, fails open)
4. Input validation (Zod schema)
5. Paywall check (free tier limit enforcement)
6. Parallel context assembly:
   a. fetchClinicalMemory(userId) — pgvector similarity search
   b. fetchPatientProfile(userId) — Prisma UserProfile
   c. fetchKnowledgeContext(query) — pgvector RAG
   d. fetchChatHistory(sessionId) — Prisma Messages
7. System prompt assembly (buildSystemPrompt)
8. LLM routing (routeRequest → Groq | OpenRouter | Ollama)
9. Streaming response via ReadableStream + SSE
10. Async: save ChatSession + Messages to DB
11. Quality scoring (scoreResponseQuality)
```

## Database Models

| Model | Purpose |
|-------|---------|
| UserProfile | Dosha scores, subscription tier, health profile |
| ChatSession | Groups messages per consultation |
| Message | Individual chat turns (user/assistant) |
| UserMemory | Extracted clinical facts with vector embeddings |
| KnowledgeChunk | Traditional medicine knowledge base (RAG) |
| ClinicLead | B2B clinic partnership inquiries |

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| DATABASE_URL / POSTGRES_PRISMA_URL | Primary DB | Yes |
| DIRECT_URL / POSTGRES_URL_NON_POOLING | Migrations | Yes |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk client | Yes |
| CLERK_SECRET_KEY | Clerk server | Yes |
| GROQ_API_KEY | Primary LLM | Yes |
| OPENROUTER_API_KEY | Fallback LLM | Yes |
| HUGGINGFACE_API_KEY | Embeddings | Yes |
| RAZORPAY_KEY_ID + SECRET | Billing | Yes |
| UPSTASH_REDIS_REST_URL + TOKEN | Rate limiting | Optional |
| CEO_BYPASS_KEY | Admin bypass | Optional |
