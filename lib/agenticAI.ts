import { getApiUrl } from './constants'
export interface AgentThought {
  step: number
  action: string
  observation: string
}

export interface AgentResponse {
  thoughts: AgentThought[]
  finalResponse: string
  recommendations: string[]
}

export async function runAgenticAI(
  userQuery: string,
  dosha: string,
  selectedSystems: string[],
  conversationHistory: Array<{ role: string; content: string }>,
  language: string
): Promise<AgentResponse> {
  const systemPrompt = `You are VAIDYA, an advanced agentic AI health companion that combines 8 healing traditions.

Your role is to:
1. Analyze the user's query deeply
2. Consider their dosha (${dosha}) and constitution
3. Cross-reference ${selectedSystems.join(', ')} traditions
4. Provide step-by-step reasoning
5. Recommend actionable next steps

Always:
- Cite classical texts (Charaka Samhita, Huangdi Neijing, etc.) when relevant
- Provide specific, measurable recommendations
- Consider the user's context and previous conversations
- Respond in ${language}
- Include safety disclaimers for serious conditions
- Format your response with clear sections for different traditions

Start with "✦ ANALYSIS:" followed by your step-by-step reasoning.
End with "✦ RECOMMENDATIONS:" followed by actionable steps.`

  const messages = [
    ...conversationHistory,
    {
      role: 'user',
      content: userQuery,
    },
  ]

  try {
    const response = await fetch(getApiUrl('/api/chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        system: systemPrompt,
        useAgentic: true,
        dosha,
        selectedSystems,
        language,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get agentic response')
    }

    const content = data.content || data.finalResponse || ''

    const thoughts = extractThoughts(content)
    const recommendations = extractRecommendations(content)

    return {
      thoughts,
      finalResponse: content,
      recommendations,
    }
  } catch (error) {
    console.error('Agentic AI error:', error)
    throw error
  }
}

function extractThoughts(content: string): AgentThought[] {
  const thoughts: AgentThought[] = []
  const analysisMatch = content.match(/✦ ANALYSIS:([\s\S]*?)(?=✦|$)/)

  if (analysisMatch) {
    const analysisText = analysisMatch[1]
    const steps = analysisText.split(/\n(?=\d+\.|Step \d+:|•|-)/i)

    steps.forEach((step, index) => {
      const trimmed = step.trim()
      if (trimmed && trimmed.length > 10) {
        thoughts.push({
          step: index + 1,
          action: 'Analyze',
          observation: trimmed.substring(0, 300),
        })
      }
    })
  }

  return thoughts.slice(0, 5)
}

function extractRecommendations(content: string): string[] {
  const recommendations: string[] = []
  const recMatch = content.match(/✦ RECOMMENDATIONS:([\s\S]*?)(?=✦|$)/)

  if (recMatch) {
    const recText = recMatch[1]
    const lines = recText.split('\n')

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (trimmed.match(/^[-•*]\s|^\d+\.\s/) && trimmed.length > 5) {
        const cleaned = trimmed.replace(/^[-•*]\s|^\d+\.\s/, '').trim()
        if (cleaned && !recommendations.includes(cleaned)) {
          recommendations.push(cleaned)
        }
      }
    })
  }

  return recommendations.slice(0, 5)
}

export function formatAgentResponse(response: AgentResponse): string {
  let formatted = response.finalResponse

  if (response.thoughts.length > 0) {
    formatted = `**✦ REASONING:**\n\n${response.thoughts.map((t) => `${t.step}. ${t.observation}`).join('\n\n')}\n\n---\n\n${formatted}`
  }

  if (response.recommendations.length > 0) {
    formatted += `\n\n**✦ NEXT STEPS:**\n${response.recommendations.map((r) => `• ${r}`).join('\n')}`
  }

  return formatted
}
