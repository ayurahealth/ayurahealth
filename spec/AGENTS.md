# Ayura Intelligence — AI Agent Design

## VAIDYA — The Core Clinical Agent

VAIDYA (Verified Ayurvedic Intelligence for Diagnostic & Yield Analysis) is the primary AI agent powering all health consultations.

### Capabilities

- **Multi-tradition reasoning**: Synthesizes guidance from 8 classical medical systems simultaneously
- **Dosha-aware context**: Personalizes responses based on user Vata/Pitta/Kapha profile
- **Clinical memory**: Recalls relevant health facts from prior conversations via pgvector
- **Deep Think mode**: Extended reasoning for complex medical queries
- **Caveman mode**: Ultra-simplified explanations for accessibility
- **Multilingual output**: Responds in user's detected language (50+ languages)
- **Tool use**: Dosha calculator, diet planner, herb suggester, vedic analyzer

### System Prompt Assembly (lib/ai/prompt-manager.ts)

```
VAIDYA_SYSTEM (core identity)
  + AYURA_INTELLIGENCE_MYTHOS (brand narrative)
  + Style instruction (dosha-aware tone)
  + Selected medical systems (user-chosen)
  + Dosha context (from UserProfile)
  + Language instruction
  + Blood report prompt (if uploaded attachment)
  + Deep Think / Caveman mode flags
  + Prompt profile (urgency, lifestyle, chronic)
  + Patient profile context (from Prisma)
  + Clinical memory context (from pgvector)
  + Response template / Vedic section
  + Agent trace context
```

## LLM Router (lib/ai/llm-router.ts)

### Provider Priority Chain

| Priority | Provider | Model | TTFT |
|----------|----------|-------|------|
| 1 (Primary) | Groq | llama-3.3-70b-versatile | ~800ms |
| 2 (Fallback) | OpenRouter | meta-llama/llama-3.3-70b-instruct | ~1.5s |
| 3 (Last resort) | Ollama | llama3.2 (local only) | N/A on Vercel |

### Streaming Architecture

All providers implement `fetchStreamingCompletion()` returning `ReadableStream<Uint8Array>`:

```
SSE Format:
data: {"content": "chunk text"}

data: {"toolCall": {...}}

data: [DONE]
```

The chat route uses a buffered line parser to prevent JSON fragmentation across chunk boundaries.

## Context Engine (lib/context-engine.ts)

### Context Sources (assembled in parallel via Promise.all)

| Source | Method | Target Latency |
|--------|--------|---------------|
| Clinical Memory | pgvector cosine similarity | ~50ms |
| Patient Profile | Prisma direct query | ~20ms |
| Knowledge RAG | pgvector cosine similarity | ~80ms |
| Chat History | Prisma session query | ~30ms |

### Embedding Model

- **Model**: `Xenova/all-MiniLM-L6-v2` (via @xenova/transformers)
- **Dimensions**: 384
- **Storage**: pgvector column (`extensions.vector(384)`) in Supabase
- **Similarity threshold**: cosine > 0.7

## Tool Definitions

VAIDYA supports structured tool calls (Groq function calling):

| Tool | Trigger | Output |
|------|---------|--------|
| `dosha_calculator` | Dosha score query | JSON breakdown |
| `herb_recommender` | Symptom query | Classical herb list |
| `diet_planner` | Diet query | Meal plan JSON |
| `vedic_analyzer` | Text analysis query | Vedic citation |
| `memory_extractor` | Post-response | Health fact extraction |

## Quality Scoring

Each response is scored (0.0–1.0) on:
- Specificity to user's dosha profile
- Citation of classical tradition
- Safety language appropriateness  
- Response length adequacy
- Latency penalty (> 5s)

Scores are logged and can be used for provider A/B testing.
