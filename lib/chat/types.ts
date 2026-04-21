export type ChatRole = 'user' | 'assistant'

export type ResponseMode = 'fast' | 'deep' | 'research'

export type AttachmentType = 'image' | 'pdf' | 'link'

export interface ChatSource {
  title: string
  content: string
  tradition: string
  source: string
}

export interface AgentTrace {
  id: 'planner' | 'researcher' | 'synthesizer'
  label: string
  summary: string
}

export interface MessageQuality {
  formatScore: number
  completeness: number
  latencyMs: number
  repaired: boolean
}

export interface MessagePolicy {
  applied: boolean
  reasons: string[]
  webSearchSuppressed: boolean
  forceDeepThink: boolean
}

export interface ChatMessage {
  role: ChatRole
  content: string
  sources?: ChatSource[]
  agentTrace?: AgentTrace[]
  modelUsed?: string
  providerUsed?: string
  quality?: MessageQuality
  policy?: MessagePolicy
}

export interface ChatAttachment {
  id: string
  type: AttachmentType
  name: string
  content: string
  preview?: string
  mimeType?: string
  url?: string
  size?: string
}

export interface ChatOptions {
  selectedSystems: string[]
  dosha: 'Vata' | 'Pitta' | 'Kapha' | null
  modelPreference: string
  responseMode: ResponseMode
  webSearchEnabled: boolean
  lang: string
  attachments: ChatAttachment[]
  vedicEnabled: boolean
  vedicContext: string | null
  cavemanMode: boolean
  incognito: boolean
}
