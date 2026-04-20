/**
 * Context Engine — Memory and knowledge retrieval for VAIDYA.
 * 
 * Manages:
 * - Clinical Memory (Supabase UserMemory)
 * - RAG knowledge retrieval (pgvector)
 * - Web search integration
 * - Agent orchestration traces
 */

import { log } from '../logger'

export interface KnowledgeChunkResult {
  title: string
  content: string
  tradition: string
  source: string
  similarity: number
}

interface WebSearchResult {
  title: string
  source: string
  content: string
}

export interface AgentTraceItem {
  id: 'planner' | 'researcher' | 'synthesizer'
  label: string
  summary: string
}

interface PrismaContextClient {
  userProfile: {
    findUnique(args: { where: { id: string } }): Promise<null | {
      primaryDosha: string | null
      healthGoal: string | null
      age: number | null
      gender: string | null
      conditions: string[]
    }>
  }
  chatSession: {
    findUnique(args: { 
      where: { id: string }
      include: { messages: { orderBy: { createdAt: 'asc' }; take: number } }
    }): Promise<null | { messages: Array<{ role: string; content: string }> }>
  }
  userMemory: {
    findMany(args: {
      where: { userId: string }
      orderBy: { createdAt: 'desc' }
      take: number
    }): Promise<Array<{ category: string; content: string; source: string }>>
  }
  $queryRawUnsafe<T>(query: string, ...params: unknown[]): Promise<T>
}

/** Lazily import Prisma to avoid cold-start overhead */
async function getPrisma(): Promise<PrismaContextClient> {
  const mod = await import('../prisma')
  return mod.prisma as unknown as PrismaContextClient
}

// ── Clinical Memory ─────────────────────────────────────────────────────────

export async function fetchClinicalMemory(userId: string): Promise<string> {
  try {
    const prisma = await getPrisma()
    const memories = await prisma.userMemory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    if (memories.length > 0) {
      return `\nVAIDYA CLINICAL MEMORY (PATIENT FILE):\n` +
        memories.map(m => `[${m.category}] ${m.content} (Source: ${m.source})`).join('\n')
    }
  } catch (err) {
    log.error('CLINICAL_MEMORY_FETCH_ERROR', { userId, error: String(err) })
  }
  return ''
}

export async function fetchPatientProfile(userId: string): Promise<string> {
  try {
    const prisma = await getPrisma()
    const profile = await prisma.userProfile.findUnique({
      where: { id: userId }
    })
    if (profile) {
      const parts = [
        `\n🩺 PATIENT CLINICAL FILE\n`,
        profile.primaryDosha ? `[Dosha] ${profile.primaryDosha}` : '',
        profile.healthGoal ? `[Health Goal] ${profile.healthGoal}` : '',
        profile.age ? `[Age] ${profile.age}` : '',
        profile.gender ? `[Gender] ${profile.gender}` : '',
        profile.conditions && profile.conditions.length > 0 
          ? `[Known Conditions] ${profile.conditions.join(', ')}` 
          : ''
      ].filter(Boolean)
      return parts.join('\n')
    }
  } catch (err) {
    log.error('PATIENT_PROFILE_FETCH_ERROR', { userId, error: String(err) })
  }
  return ''
}

export async function fetchChatHistory(sessionId: string): Promise<Array<{ role: string; content: string }>> {
  try {
    const prisma = await getPrisma()
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      // Use explicit cast to bypass the restrictive 'asc' type blocker in the generated client
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      include: { messages: { orderBy: { createdAt: 'desc' as any }, take: 15 } }
    })
    // Reverse to chronological order for AI context (Finding #7)
    return (session?.messages || []).reverse()
  } catch (err) {
    log.error('CHAT_HISTORY_FETCH_ERROR', { sessionId, error: String(err) })
    return []
  }
}

// ── RAG Knowledge Retrieval ─────────────────────────────────────────────────

export async function fetchKnowledgeContext(userQuery: string): Promise<{
  context: string
  chunks: KnowledgeChunkResult[]
}> {
  if (!userQuery || userQuery.length <= 3) {
    return { context: '', chunks: [] }
  }

  try {
    const prisma = await getPrisma()
    const { getEmbedding } = await import('./embeddings')
    const queryEmbedding = await getEmbedding(userQuery)
    const vectorString = `[${queryEmbedding.join(',')}]`

    const chunks = await prisma.$queryRawUnsafe<KnowledgeChunkResult[]>(
      `SELECT title, content, tradition, source, 1 - (embedding <=> $1::vector) as similarity 
       FROM "KnowledgeChunk" 
       WHERE 1 - (embedding <=> $1::vector) > 0.6
       ORDER BY similarity DESC 
       LIMIT 3`,
      vectorString
    )

    if (chunks && chunks.length > 0) {
      const context = `\nRELEVANT CLASSICAL WISDOM FROM AI BRAIN:\n` +
        chunks.map(c => `[${c.tradition}] ${c.title}: ${c.content} (Source: ${c.source})`).join('\n')
      return { context, chunks }
    }
  } catch (err) {
    log.error('RAG_RETRIEVAL_ERROR', { error: String(err) })
  }
  return { context: '', chunks: [] }
}

// ── Web Search ──────────────────────────────────────────────────────────────

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '')
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

export async function fetchWebSearchResults(query: string): Promise<WebSearchResult[]> {
  try {
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AyuraIntelligenceBot/1.0; +https://ayurahealth.com)',
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return []
    const html = await response.text()

    const anchorRegex = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g
    const results: WebSearchResult[] = []
    let match: RegExpExecArray | null

    while ((match = anchorRegex.exec(html)) !== null && results.length < 5) {
      const source = decodeHtml(match[1] || '').trim()
      const title = stripTags(decodeHtml(match[2] || '')).trim()
      if (!source || !title) continue
      results.push({ title, source, content: `Recent reference related to "${query}".` })
    }

    return results
  } catch (err) {
    log.error('WEB_SEARCH_ERROR', { error: String(err) })
    return []
  }
}

export async function fetchWebContext(query: string): Promise<{
  context: string
  chunks: KnowledgeChunkResult[]
}> {
  const results = await fetchWebSearchResults(query)
  if (results.length === 0) {
    return { context: '', chunks: [] }
  }

  const chunks: KnowledgeChunkResult[] = results.map(r => ({
    title: r.title,
    content: r.content,
    tradition: 'Web',
    source: r.source,
    similarity: 1,
  }))

  const context = `\nWEB SEARCH (RECENT SOURCES):\n` +
    results.map(r => `[Web] ${r.title}: ${r.content} (${r.source})`).join('\n')

  return { context, chunks }
}

// ── Agent Orchestration ─────────────────────────────────────────────────────

interface AgentStepArgs {
  apiUrl: string
  headers: Record<string, string>
  model: string
  roleInstruction: string
  userInput: string
}

interface AgentStepResponse {
  choices?: Array<{ message?: { content?: string } }>
}

async function runAgentStep(args: AgentStepArgs): Promise<string> {
  try {
    const response = await fetch(args.apiUrl, {
      method: 'POST',
      headers: args.headers,
      body: JSON.stringify({
        model: args.model,
        stream: false,
        temperature: 0.2,
        max_tokens: 350,
        messages: [
          { role: 'system', content: args.roleInstruction },
          { role: 'user', content: args.userInput },
        ],
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) return ''
    const json = (await response.json().catch(() => null)) as AgentStepResponse | null
    return json?.choices?.[0]?.message?.content?.trim() || ''
  } catch (err) {
    log.error('AGENT_STEP_ERROR', { error: String(err) })
    return ''
  }
}

export async function orchestrateAgents(args: {
  userQuery: string
  knowledgeCtx: string
  apiUrl: string
  headers: Record<string, string>
  model: string
}): Promise<{ agentTrace: AgentTraceItem[]; context: string }> {
  const agentTrace: AgentTraceItem[] = []

  try {
    const planner = await runAgentStep({
      apiUrl: args.apiUrl,
      headers: args.headers,
      model: args.model,
      roleInstruction: 'You are Planner Agent. Build a short plan for answering this user health query safely. Return max 4 bullets.',
      userInput: args.userQuery,
    })
    if (planner) {
      agentTrace.push({ id: 'planner', label: 'Planner', summary: planner.slice(0, 320) })
    }

    const researcher = await runAgentStep({
      apiUrl: args.apiUrl,
      headers: args.headers,
      model: args.model,
      roleInstruction: `You are Research Agent. Use this context and return concise evidence bullets:\n${args.knowledgeCtx || 'No extra context found.'}`,
      userInput: args.userQuery,
    })
    if (researcher) {
      agentTrace.push({ id: 'researcher', label: 'Researcher', summary: researcher.slice(0, 420) })
    }

    agentTrace.push({
      id: 'synthesizer',
      label: 'Synthesizer',
      summary: 'Combining planner and research outputs into one concise clinical response.',
    })
  } catch (err) {
    log.error('AGENT_ORCHESTRATION_ERROR', { error: String(err) })
  }

  const context = agentTrace.length > 0
    ? `\nAGENT TRACE BRIEF:\n${agentTrace.map(a => `- ${a.label}: ${a.summary}`).join('\n')}\n`
    : ''

  return { agentTrace, context }
}
