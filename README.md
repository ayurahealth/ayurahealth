# Ayura Intelligence — Neural Synthesis & Strategic Health

[![Production](https://img.shields.io/badge/status-live-brightgreen)](https://ayurahealth.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/deployed-Vercel-black)](https://vercel.com)

> **Ancient Wisdom. Neural Synthesis. Modern Healing.**

Ayura Intelligence is a high-performance clinical AI platform combining **8 traditional medical systems** with deep-reasoning neural architectures to provide personalized, citation-grounded health guidance.

🌐 **Live at [ayurahealth.com](https://ayurahealth.com)**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **VAIDYA Chat** | Streaming AI consultations powered by Groq (llama-3.3-70b) |
| 🌿 **8 Medical Traditions** | Ayurveda, TCM, Tibetan, Unani, Siddha, Homeopathy, Naturopathy, Functional |
| 🎯 **Dosha Profiling** | Personalized Vata/Pitta/Kapha analysis via clinical intake quiz |
| 🧬 **Clinical Memory** | pgvector-powered memory retrieves relevant health context |
| 🌐 **Multilingual** | 50+ languages, auto-detected and responded to |
| 📱 **iOS PWA** | Progressive Web App + Capacitor native build |
| 🔒 **Privacy-First** | No health data sold; HIPAA-compatible trajectory |
| ⚡ **< 1.5s TTFT** | Groq-powered first token in under 1.5 seconds |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Vanilla CSS (custom design system) + Framer Motion |
| Auth | Clerk |
| Database | Supabase PostgreSQL + pgvector |
| ORM | Prisma 7 |
| AI Primary | Groq (llama-3.3-70b-versatile) |
| AI Fallback | OpenRouter (llama-3.3-70b-instruct) |
| Embeddings | HuggingFace (all-MiniLM-L6-v2, 384-dim) |
| Rate Limiting | Upstash Redis |
| Billing | Razorpay |
| Deployment | Vercel |
| iOS | Capacitor 8 |

---

## 🚀 Local Development

### Prerequisites
- Node.js 22.0.0+
- npm
- Supabase account (or local PostgreSQL with pgvector)
- Clerk account
- Groq API key

### Setup

```bash
# Clone the repository
git clone https://github.com/ayurahealth/ayurahealth.git
cd ayurahealth

# Install dependencies
npm install --legacy-peer-deps

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
# → http://localhost:3000
```

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript type check |
| `npm run lint` | ESLint check |
| `npm run ios:setup` | Build + sync + open Xcode |

---

## 📁 Project Structure

```
├── app/              # Next.js App Router (pages + API routes)
├── lib/              # Core logic (AI, Prisma, hooks, utilities)
│   ├── ai/           # LLM router, prompt manager, providers
│   └── hooks/        # React hooks (useChat streaming)
├── components/       # Shared React components
├── prisma/           # Database schema and migrations
├── spec/             # Product and technical specifications
├── docs/             # Deployment and operational guides
├── scripts/          # Build-time validation scripts
└── middleware.ts     # Edge authentication guard
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [spec/GOAL.md](./spec/GOAL.md) | Product vision and north star metrics |
| [spec/ARCHITECTURE.md](./spec/ARCHITECTURE.md) | System design and data flow |
| [spec/AGENTS.md](./spec/AGENTS.md) | VAIDYA AI agent design |
| [spec/REQUIREMENTS.md](./spec/REQUIREMENTS.md) | Functional and NFR requirements |
| [spec/STRATEGY.md](./spec/STRATEGY.md) | Business and growth strategy |
| [spec/DEVELOPMENT_FLOW.md](./spec/DEVELOPMENT_FLOW.md) | Git workflow and CI/CD |
| [docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) | Production deployment |
| [docs/SECURITY_AUDIT.md](./docs/SECURITY_AUDIT.md) | Security practices |
| [CLAUDE.md](./CLAUDE.md) | AI assistant context file |

---

## 🔒 Security

- **Secrets**: All via Vercel environment variables, never in code
- **Rate Limiting**: 10 req/min/IP via Upstash Redis (fails open)
- **Auth Guard**: Edge middleware with dynamic Clerk import
- **Webhook Verification**: HMAC-SHA256 for Clerk and Razorpay
- **Input Validation**: Zod schemas on all API routes
- **Request Size**: MAX_CONTENT_BYTES limit on all endpoints

---

## 🌐 Production

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health` | System health check |
| `GET /api/env-check` | Environment variable diagnostics |
| `POST /api/chat` | VAIDYA chat (SSE streaming) |

```bash
# Check production health
curl https://ayurahealth.com/api/health
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and run `npm run typecheck`
4. Commit with [conventional commits](https://conventionalcommits.org/): `git commit -m "feat: ..."`
5. Push and open a PR to `main`

See [spec/DEVELOPMENT_FLOW.md](./spec/DEVELOPMENT_FLOW.md) for full workflow.

---

## ⚠️ Medical Disclaimer

Ayura Intelligence is for **educational and informational purposes only**. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

© 2026 Ayura Intelligence Lab · [ayurahealth.com](https://ayurahealth.com)
