# CLAUDE.md — AI Assistant Context for Ayura Intelligence

This file provides context for AI coding assistants (Claude, Gemini, etc.) working on the Ayura Intelligence codebase.

## Project Identity

**Ayura Intelligence** is a clinical AI health platform that synthesizes guidance from 8 traditional medical systems using neural AI. Live at [ayurahealth.com](https://ayurahealth.com).

**Stack**: Next.js 15 (App Router) · TypeScript · Prisma · Supabase (PostgreSQL + pgvector) · Clerk Auth · Groq/OpenRouter LLMs · Vercel

## Critical Rules for AI Assistants

### 1. Never break the build
- Always run `npm run typecheck` mentally before suggesting changes
- The middleware.ts MUST dynamically import `@clerk/nextjs/server` (not at module level)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` may be absent at edge runtime — handle gracefully

### 2. Streaming SSE is sacred
- All LLM streams must buffer chunks: `buffer += decoder.decode(value, {stream: true})`
- Split on `\n`, pop last element back to buffer
- Never assume a full JSON object arrives in a single chunk

### 3. Prisma is dynamic
- `lib/prisma.ts` exports a singleton `prisma` client
- In streaming contexts, import via `await import('@/lib/prisma')`
- DB failures must NEVER crash the streaming response — catch and log

### 4. Fallback chain is mandatory
- LLM providers: Groq → OpenRouter → Ollama
- Rate limiter (Upstash Redis) fails open (allows requests if Redis is down)
- Clerk auth fails open for public routes (redirects for protected routes)

### 5. Secrets policy
- NEVER hardcode API keys or secrets
- All secrets via `.env.local` (dev) or Vercel environment variables (prod)
- The `.gitignore` excludes all `.env*` files except `.env.example`

## Key Files

| File | Purpose |
|------|---------|
| `app/api/chat/route.ts` | Main VAIDYA chat handler (SSE streaming) |
| `lib/ai/llm-router.ts` | LLM provider selection + fallback chain |
| `lib/ai/prompt-manager.ts` | System prompt assembly |
| `lib/ai/providers/groq.ts` | Groq API integration |
| `lib/ai/providers/openrouter.ts` | OpenRouter API integration |
| `lib/context-engine.ts` | Clinical memory + RAG context |
| `lib/prisma.ts` | Prisma singleton with env fallbacks |
| `lib/hooks/useChat.ts` | React SSE streaming consumer |
| `middleware.ts` | Edge Clerk auth guard (dynamic import) |
| `prisma/schema.prisma` | Database schema |

## Environment Variables (Required)

```
DATABASE_URL or POSTGRES_PRISMA_URL
DIRECT_URL or POSTGRES_URL_NON_POOLING
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
GROQ_API_KEY
OPENROUTER_API_KEY
HUGGINGFACE_API_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
```

## Common Pitfalls

1. **`force-static` on API routes** — Breaks dynamic request handling. Always use `force-dynamic` or no directive on API routes.
2. **`currentUser()` outside try-catch** — Can throw if Clerk key is missing. Always wrap.
3. **Sending empty `tools: []` to Groq** — Returns 400. Only include `tools` in payload if `tools.length > 0`.
4. **OpenRouter model names** — Use `meta-llama/llama-3.3-70b-instruct` not `google/gemini-2.5-pro` (not available on OpenRouter).
5. **Missing `{stream: true}` in TextDecoder** — Causes multibyte character corruption across chunk boundaries.

## Deployment

```bash
# Push to production
git push origin main
git push origin main:deploy/production-gold

# Check production health
curl https://ayurahealth.com/api/health
curl https://ayurahealth.com/api/env-check
```

## Architecture Reference

See [spec/ARCHITECTURE.md](./spec/ARCHITECTURE.md) for full system design.
See [spec/AGENTS.md](./spec/AGENTS.md) for AI agent design.
