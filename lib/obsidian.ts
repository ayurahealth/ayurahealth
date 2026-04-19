/**
 * Obsidian Utility — Intelligence Export Logic for Ayura Intelligence Lab.
 */

import { Message } from './hooks/useChat'

export const OBSIDIAN_CATEGORIES = ['Health', 'Research', 'Academic', 'Business', 'Personal', 'Ideas', 'Legal', 'Tech'] as const

function sanitizeFilePart(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'chat'
}

function toWikiName(input: string): string {
  return input.replace(/[^a-zA-Z0-9\s/-]+/g, '').trim() || 'Ayura Intelligence Note'
}

export function exportChatToObsidian(messages: Message[], options: {
  dosha: string | null
  currentSystems: string[]
  lang: string
  includeSources?: boolean
  selectedOnly?: boolean
  method?: 'download' | 'uri'
  category?: string
  relatedNotes?: string
  obsidianVault?: string
  obsidianSelectedCount: number
  vedicEnabled: boolean
  vedicContext: string | null
}) {
  if (messages.length === 0) return

  const includeSources = Boolean(options.includeSources)
  const method = options.method || 'download'
  let exportMessages = messages

  if (options.selectedOnly) {
    const safeCount = Math.min(messages.length, Math.max(1, options.obsidianSelectedCount))
    exportMessages = messages.slice(-safeCount)
  }

  const now = new Date()
  const iso = now.toISOString()
  const datePart = iso.slice(0, 10)
  const timePart = iso.slice(11, 16).replace(':', '-')
  const doshaPart = options.dosha ? sanitizeFilePart(options.dosha) : 'general'
  const chosenCategory = options.category || 'Health'
  const categorySlug = sanitizeFilePart(chosenCategory)
  
  const relatedNotes = (options.relatedNotes || '')
    .split(',')
    .map((n) => toWikiName(n.trim()))
    .filter(Boolean)
    .slice(0, 20)

  const fileName = `AyuraIntelligence/${categorySlug}/Session/intel-${datePart}-${timePart}-${doshaPart}${includeSources ? '-sources' : ''}.md`
  const sessionWiki = toWikiName(`Ayura Intelligence ${datePart} ${timePart} ${options.dosha ?? 'General'}`)
  const brainHome = 'Intelligence Home'
  const categoryHub = `${chosenCategory} Hub`

  const frontmatter = [
    '---',
    `title: "${sessionWiki}"`,
    `created: "${iso}"`,
    `source: "Ayura Intelligence"`,
    `dosha: "${options.dosha ?? 'unknown'}"`,
    `category: "${chosenCategory}"`,
    `systems: [${options.currentSystems.map(s => `"${s}"`).join(', ')}]`,
    `language: "${options.lang}"`,
    `vedic_context_used: ${Boolean(options.vedicEnabled && options.vedicContext)}`,
    `message_count: ${exportMessages.length}`,
    `related_notes: [${relatedNotes.map((n) => `"${n}"`).join(', ')}]`,
    'tags: ["ayuraintelligence","synthesis","neural-ai"]',
    '---',
    '',
    `[[${brainHome}]]`,
    '',
    `[[${categoryHub}]]`,
    '',
    `Related: [[Dosha/${options.dosha ?? 'General'}]]`,
    '',
  ].join('\n')

  const body = exportMessages.map((m, idx) => {
    const role = m.role === 'assistant' ? 'VAIDYA' : 'User'
    const content = m.content.replace(/\r\n/g, '\n')
    return `## ${idx + 1}. ${role}\n\n${content}\n`
  }).join('\n')

  const sourcesBlock = includeSources
    ? exportMessages
        .map((m, idx) => {
          if (!m.sources || m.sources.length === 0) return ''
          const list = m.sources.map((s, i) =>
            `- ${i + 1}. **${s.tradition}** — ${s.title} (${s.source})\n  - ${s.content.slice(0, 260).replace(/\n/g, ' ')}${s.content.length > 260 ? '...' : ''}`
          ).join('\n')
          return `### Sources for message ${idx + 1}\n${list}\n`
        })
        .filter(Boolean)
        .join('\n')
    : ''

  const footer = [
    '',
    '## Brain Links',
    '',
    `- Category hub: [[${categoryHub}]]`,
    `- Master hub: [[${brainHome}]]`,
    ...relatedNotes.map((n) => `- Existing note: [[${n}]]`),
    '',
    sourcesBlock ? '## Sources & Citations\n' : '',
    sourcesBlock,
    '',
    '---',
    '',
    '_Educational guidance only. Not medical advice._',
    '',
    `Exported from https://ayurahealth.com at ${iso}`,
    '',
  ].join('\n')

  const markdown = `${frontmatter}${body}${footer}`
  
  if (method === 'uri') {
    const vaultParam = options.obsidianVault?.trim() ? `&vault=${encodeURIComponent(options.obsidianVault.trim())}` : ''
    const sessionUrl = `obsidian://new?name=${encodeURIComponent(sessionWiki)}${vaultParam}&content=${encodeURIComponent(markdown)}`
    window.location.href = sessionUrl
    return
  }

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
准确
