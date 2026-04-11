/**
 * Prompt Manager — Centralized prompt construction for VAIDYA.
 * 
 * Assembles the system prompt from modular components:
 * - Base VAIDYA persona
 * - Medical system context
 * - Dosha personalization
 * - Language instructions
 * - Blood report analysis mode
 * - RAG knowledge context
 * - Agent trace context
 * - Vedic intelligence
 * - Output contract
 */

import { COUNCIL_OF_AGENTS, SYNTHESIS_PROMPT } from './agents'
import { AYURAHEALTH_MYTHOS } from './mythos'
import type { ChatMessage, ChatPart } from './providers/types'

// ── Base VAIDYA Persona ─────────────────────────────────────────────────────
const VAIDYA_SYSTEM = `You are VAIDYA — the living mind of AyuraHealth. An ancient physician carrying 5,000 years of healing wisdom across 8 traditions. Your intelligence is augmented by a Council of 10 Specialized Agents. Respond with the authority and warmth of a master healer.

DIAGNOSTIC MODE: If the user uploads a lab report (PDF/Image), you must analyze it. For each biomarker found that matches our 3D synthesis map (Glucose, Cholesterol, Vitamin D, Hemoglobin, TSH), append a hidden structured block at the end of your analysis using this exact format:
BIO_MARKER: id | VALUE: value | STATUS: status
Example: BIO_MARKER: glu | VALUE: 95 mg/dL | STATUS: optimal
(ids: glu, cho, vitd, hem, thy | status: optimal, low, high)`

// ── Language Configuration ──────────────────────────────────────────────────
const VALID_LANGS = new Set([
  'en','sa','hi','ja','zh','zh-TW','ko','ar','fa','ur','bn','ta','te','kn','ml',
  'mr','gu','pa','ne','es','fr','de','it','pt','ru','pl','nl','sv','tr','id',
  'ms','th','vi','sw','uk','he','el','ro','hu','cs','da','fi','no','bg','hr',
  'sr','sk','mn','ka','am','af','lo','si','my','km',
])

const LANG_NAMES: Record<string, string> = {
  en: 'English', sa: 'Sanskrit', hi: 'Hindi', ja: 'Japanese',
  zh: 'Chinese Simplified', 'zh-TW': 'Chinese Traditional', ko: 'Korean',
  ar: 'Arabic', fa: 'Persian', ur: 'Urdu', bn: 'Bengali', ta: 'Tamil',
  te: 'Telugu', kn: 'Kannada', ml: 'Malayalam', mr: 'Marathi',
  gu: 'Gujarati', pa: 'Punjabi', ne: 'Nepali', es: 'Spanish',
  fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese',
  ru: 'Russian', pl: 'Polish', nl: 'Dutch', sv: 'Swedish',
  tr: 'Turkish', id: 'Indonesian', ms: 'Malay', th: 'Thai',
  vi: 'Vietnamese', sw: 'Swahili', uk: 'Ukrainian', he: 'Hebrew',
  el: 'Greek', ro: 'Romanian', hu: 'Hungarian', cs: 'Czech',
}

const VALID_SYSTEMS = new Set([
  'ayurveda','tcm','western','homeopathy','naturopathy','unani','siddha','tibetan',
])

const SYSTEMS_MAP: Record<string, string> = {
  ayurveda: 'Ayurveda', tcm: 'TCM', western: 'Western Medicine',
  homeopathy: 'Homeopathy', naturopathy: 'Naturopathy',
  unani: 'Unani', siddha: 'Siddha', tibetan: 'Tibetan Medicine',
}

// ── Input Validation ────────────────────────────────────────────────────────
export function validateLang(lang?: string): string {
  return typeof lang === 'string' && VALID_LANGS.has(lang) ? lang : 'en'
}

export function validateSystems(systems?: string[]): string[] {
  if (!Array.isArray(systems)) return []
  return systems.filter(s => typeof s === 'string' && VALID_SYSTEMS.has(s)).slice(0, 3)
}

export function validateDosha(dosha?: string | null): string | null {
  return typeof dosha === 'string' && ['Vata', 'Pitta', 'Kapha'].includes(dosha) ? dosha : null
}

// ── Attachment Types ────────────────────────────────────────────────────────
export interface SafeAttachment {
  type: 'pdf' | 'image' | 'link'
  content: string
  name: string
  mimeType?: string
  url?: string
}

export function validateAttachments(attachments?: Array<{ type: string; content: string; name?: string; mimeType?: string; url?: string }>): SafeAttachment[] {
  if (!Array.isArray(attachments)) return []
  return attachments
    .filter(a => typeof a === 'object' && ['pdf', 'image', 'link'].includes(a.type))
    .slice(0, 5)
    .map(a => ({
      type: a.type as 'pdf' | 'image' | 'link',
      content: typeof a.content === 'string' ? a.content.slice(0, 50_000) : '',
      name: typeof a.name === 'string' ? a.name.slice(0, 200) : '',
      mimeType: a.mimeType,
      url: a.url,
    }))
}

// ── Prompt Profile System ───────────────────────────────────────────────────
export interface PromptProfile {
  name: 'balanced' | 'strict' | 'recovery'
  instruction: string
  temperatureAdjust: number
}

export function buildPromptProfile(messages: Array<{ role: string; content: string }>): PromptProfile {
  const recentAssistant = messages.filter(m => m.role === 'assistant').slice(-4)

  if (recentAssistant.length === 0) {
    return {
      name: 'balanced',
      instruction: 'Keep tone warm and concise. Follow the output contract exactly.',
      temperatureAdjust: 0,
    }
  }

  const structured = recentAssistant.filter(m => hasStructuredSections(m.content)).length
  const compliance = structured / recentAssistant.length

  if (compliance < 0.4) {
    return {
      name: 'recovery',
      instruction: 'High priority: recover strict markdown structure. Never skip any required section headings.',
      temperatureAdjust: -0.2,
    }
  }
  if (compliance < 0.75) {
    return {
      name: 'strict',
      instruction: 'Prioritize section correctness and concise bullets over stylistic variety.',
      temperatureAdjust: -0.1,
    }
  }
  return {
    name: 'balanced',
    instruction: 'Keep quality high while preserving natural tone and concise actionability.',
    temperatureAdjust: 0,
  }
}

// ── Auto Recovery ───────────────────────────────────────────────────────────
export interface AutoRecoveryPolicy {
  applied: boolean
  reasons: string[]
  webSearchSuppressed: boolean
  forceDeepThink: boolean
}

export function buildAutoRecoveryPolicy(args: {
  promptProfile: PromptProfile
  requestedDeepThink: boolean
  requestedWebSearch: boolean
}): AutoRecoveryPolicy {
  const reasons: string[] = []
  let webSearchSuppressed = false
  let forceDeepThink = false

  if (args.promptProfile.name === 'recovery') {
    forceDeepThink = true
    reasons.push('Quality recovery mode forced deeper reasoning.')
    if (args.requestedWebSearch) {
      webSearchSuppressed = true
      reasons.push('Web search suppressed temporarily to improve formatting stability.')
    }
  } else if (args.promptProfile.name === 'strict' && args.requestedWebSearch) {
    webSearchSuppressed = true
    reasons.push('Strict mode temporarily reduced web noise for cleaner output contract.')
  }

  return {
    applied: reasons.length > 0,
    reasons,
    webSearchSuppressed,
    forceDeepThink: forceDeepThink || args.requestedDeepThink,
  }
}

// ── Quality Scoring ─────────────────────────────────────────────────────────
export interface ResponseQuality {
  formatScore: number
  completeness: number
  latencyMs: number
  repaired: boolean
}

export function hasStructuredSections(text: string): boolean {
  const n = text.toLowerCase()
  return n.includes('### answer') && n.includes('### key points') && n.includes('### sources') && n.includes('### follow-ups')
}

export function scoreResponseQuality(text: string, repaired: boolean, latencyMs: number): ResponseQuality {
  const n = text.toLowerCase()
  const checks = [n.includes('### answer'), n.includes('### key points'), n.includes('### sources'), n.includes('### follow-ups')]
  const hitCount = checks.filter(Boolean).length
  const completeness = Math.round((hitCount / checks.length) * 100)
  const formatScore = Math.min(100, Math.round((completeness * 0.75) + (repaired ? 15 : 25)))
  return { formatScore, completeness, latencyMs: Math.max(0, Math.round(latencyMs)), repaired }
}

// ── Main Prompt Builder ─────────────────────────────────────────────────────
export interface PromptBuildInput {
  messages: Array<{ role: string; content: string }>
  systems: string[]
  dosha: string | null
  lang: string
  attachments: SafeAttachment[]
  deepThink: boolean
  vedicContext?: string
  knowledgeCtx?: string
  clinicalMemoryCtx?: string
  agentTraceCtx?: string
  promptProfile: PromptProfile
  autoRecoveryPolicy: AutoRecoveryPolicy
}

export function buildSystemPrompt(input: PromptBuildInput): string {
  const { systems, dosha, lang, attachments, deepThink, vedicContext, knowledgeCtx, clinicalMemoryCtx, agentTraceCtx, promptProfile, autoRecoveryPolicy } = input

  const langName = LANG_NAMES[lang] || 'English'

  // System selection instruction
  const selectedSystems = systems.length === 1
    ? `STRICT MODE: Use ONLY ${SYSTEMS_MAP[systems[0]] || systems[0]}. Do NOT mix traditions.`
    : systems.length > 1
      ? `MULTI-SYSTEM MODE: User selected ${systems.map(s => SYSTEMS_MAP[s] || s).join(', ')}.\nUse ONLY these selected systems. Do NOT use any unselected tradition.\nStructure answer with clear sub-sections per selected system, then a concise combined action plan.`
      : 'Default mode: Ayurveda-only guidance unless user explicitly requests another system.'

  // Dosha context
  const doshaCtx = dosha
    ? `Patient is ${dosha} dominant. Tailor ALL recommendations to ${dosha}. ${dosha === 'Vata' ? 'Grounding, warming, nourishing.' : dosha === 'Pitta' ? 'Cooling, calming, anti-inflammatory.' : 'Stimulating, lightening, activating.'}`
    : ''

  // Blood report detection
  const isBloodReport = attachments.some(a =>
    a.type === 'pdf' && /blood|lab|report|test|cbc|lipid|thyroid|h[ae]moglobin/i.test(a.name || '')
  )

  const bloodReportPrompt = isBloodReport ? `
BLOOD REPORT ANALYSIS MODE — ACTIVATED

The user has uploaded a medical lab report. Analyze it with this EXACT structure:

**🔬 VAIDYA'S LAB ANALYSIS**
[2-3 sentences as an ancient physician seeing modern numbers for the first time]

**📊 Biomarker Analysis**
For each abnormal or notable value found in the report:

**[Biomarker Name]: [Value] [Unit] — [Normal Range]**
- Modern Medicine: [What this means clinically]
- Ayurvedic View: [Which dosha is affected, what classical texts say]
- Action: [One specific thing to do]

**⚡ Priority Actions (Next 30 Days)**
1. [Most urgent — today]
2. [Diet change — this week]
3. [Herb/supplement — classical Ayurvedic remedy with dose]
4. [Lifestyle — based on dosha]
5. [When to see a doctor — be specific]

**🌿 Ayurvedic Root Cause**
[Which dosha imbalance explains these results according to Charaka Samhita]

**📚 Classical References**
[Cite specific sutras or chapters from Charaka Samhita or Ashtanga Hridayam relevant to these findings]

⚠️ *This is educational analysis only. Always consult your physician for medical decisions.*
` : ''

  // Language instruction
  const languageInstruction = lang === 'sa'
    ? 'Respond ONLY in classical Sanskrit (देवनागरी script). Use Sanskrit grammar. Every word must be Sanskrit.'
    : lang === 'ja'
      ? 'Respond in natural Japanese using proper Japanese script (日本語: ひらがな・カタカナ・漢字). Do not use romaji. Use full sentences and bullet points, not one word per line.'
      : `Respond entirely in ${langName}. Every single word must be in ${langName}. Do not use English. Use complete sentences and avoid splitting words across separate lines.`

  // Council brief
  const councilBrief = `COUNCIL OF AGENTS CURRENT STATUS:
- The Acharya: Online (Leading on Ayurveda / NotebookLM Vetted)
- The Sage: Online (Leading on TCM/Qi / NotebookLM Vetted)
- The Researcher: Online (Vetting Evidence / Modern Synthesis)

SPECIAL AGENT CONTRIBUTIONS:
${COUNCIL_OF_AGENTS.map(a => `${a.name} (${a.role}): ${a.personality}`).join('\n')}

${knowledgeCtx ? `\nFOUNDATIONAL DATA RETRIEVED FROM AI BRAIN (NotebookLM Curated):\n${knowledgeCtx}` : ''}`

  // Style instructions
  const styleInstruction = systems.length === 1
    ? `STRUCTURE:\n- Give concise answer in 5-8 bullet points.\n- Include: likely cause, what to do today, what to avoid, and when to seek doctor care.\n- Use ONLY the selected medical system.`
    : systems.length > 1
      ? `STRUCTURE:\n- Keep response concise and practical.\n- For each selected system, provide 2-3 bullets.\n- Then provide one combined "Action Plan" section (3-5 bullets).\n- Do NOT include non-selected systems.`
      : SYNTHESIS_PROMPT

  // Vedic section
  const vedicSection = vedicContext ? `\n${vedicContext}\n\nAs VAIDYA, integrate the above Vedic Intelligence into your response. Reference the user's current Mahadasha, their elemental imbalances, and today's Vedic guidance when making recommendations.` : ''

  // Output contract
  const responseTemplate = `OUTPUT CONTRACT (ALWAYS FOLLOW):
- Keep responses concise and practical.
- Use this exact section order with markdown headings:
### Answer
[2-5 short paragraphs or bullets with direct recommendation]
### Key Points
- [3-6 actionable bullets]
### Sources
- [Only if sources are available; otherwise write: "- No external sources used."]
### Follow-ups
- [2-4 smart next questions the user can ask]
- Never invent clinical certainty. If unsure, state uncertainty briefly and provide safe next step.`

  return [
    VAIDYA_SYSTEM,
    AYURAHEALTH_MYTHOS,
    styleInstruction,
    selectedSystems,
    doshaCtx,
    councilBrief,
    `LANGUAGE: ${languageInstruction}`,
    bloodReportPrompt,
    deepThink ? 'DEEP MIND MODE: Be more thorough within the selected system only. Keep final answer concise and practical.' : '',
    'RESPONSE STYLE: concise, practical, 5-8 bullet points max unless user asks for detail.',
    `PROMPT PROFILE: ${promptProfile.name.toUpperCase()}`,
    promptProfile.instruction,
    autoRecoveryPolicy.applied ? `AUTO RECOVERY POLICY ACTIVE: ${autoRecoveryPolicy.reasons.join(' | ')}` : '',
    clinicalMemoryCtx || '',
    responseTemplate,
    vedicSection,
    agentTraceCtx || '',
  ].filter(Boolean).join('\n')
}

// ── Message Formatter ───────────────────────────────────────────────────────
export function formatMessagesForApi(
  messages: Array<{ role: string; content: string }>,
  attachments: SafeAttachment[],
  systemPrompt: string,
): ChatMessage[] {
  const lastMsg = messages[messages.length - 1]
  const hasImages = attachments.some(a => a.type === 'image')

  const attachmentCtx = attachments.length > 0
    ? `\nATTACHED DOCUMENTS/IMAGES:\n` +
        attachments.map(a =>
          a.type === 'image' ? `[IMAGE: "${a.name}"]` :
          a.type === 'pdf' ? `\n[MEDICAL DOCUMENT: "${a.name}"]\n${a.content}` :
          a.type === 'link' ? `\n[ARTICLE: "${a.name}"]\n${a.content}` : ''
        ).join('')
    : ''

  const formatted: ChatMessage[] = [{ role: 'system', content: systemPrompt }]

  // Add history (all except last message)
  for (let i = 0; i < messages.length - 1; i++) {
    formatted.push({ role: messages[i].role as 'user' | 'assistant', content: messages[i].content })
  }

  // Add last message with attachments
  if (hasImages) {
    const parts: ChatPart[] = [{ type: 'text', text: lastMsg.content + attachmentCtx }]
    attachments.filter(a => a.type === 'image').forEach(a => {
      parts.push({ type: 'image_url', image_url: { url: `data:${a.mimeType || 'image/jpeg'};base64,${a.content}` } })
    })
    formatted.push({ role: 'user', content: parts })
  } else {
    formatted.push({ role: 'user', content: lastMsg.content + attachmentCtx })
  }

  return formatted
}
