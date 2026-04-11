/**
 * Tool Executor — Standardized agentic tool framework for VAIDYA.
 * 
 * Defines tools that can be called by LLMs during a session.
 * Supports:
 * - search_web: Fetch real-time health news/research.
 * - get_vedic_profile: Calculate birth chart and pancha bhuta balance.
 * - analyze_biomarkers: Parse lab reports for Vedic correlation.
 */

import { fetchWebSearchResults } from './context-engine'
import { log } from '../logger'

export interface ToolDefinition {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, { type: string; description: string; enum?: string[] }>
    required: string[]
  }
}

export const VAIDYA_TOOLS: ToolDefinition[] = [
  {
    name: 'search_web',
    description: 'Search the web for recent health articles, clinical studies, or medical news.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query to use.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_vedic_profile',
    description: 'Calculate a detailed Vedic birth chart and elemental balance based on birth details.',
    parameters: {
      type: 'object',
      properties: {
        dob: { type: 'string', description: 'Date of birth (YYYY-MM-DD)' },
        tob: { type: 'string', description: 'Time of birth (HH:mm)' },
        pob: { type: 'string', description: 'Place of birth (City name)' },
      },
      required: ['dob', 'tob', 'pob'],
    },
  },
]

export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string // JSON string
  }
}

export interface ToolResult {
  tool_call_id: string
  output: string
}

/**
 * Execute a tool call and return the result as a string.
 */
export async function executeToolCall(call: ToolCall): Promise<ToolResult> {
  const { name, arguments: argsJson } = call.function
  const { id } = call
  log.info('TOOL_CALL_EXECUTING', { name, id })

  try {
    const args = JSON.parse(argsJson)

    switch (name) {
      case 'search_web': {
        const results = await fetchWebSearchResults(args.query)
        return {
          tool_call_id: id,
          output: JSON.stringify(results.map(r => ({ title: r.title, source: r.source, snippet: r.content }))),
        }
      }

      case 'get_vedic_profile': {
        // Here we would call the internal /api/vedic/analyze logic
        // For now, return a placeholder that prompt engineering can handle
        return {
          tool_call_id: id,
          output: "Vedic calculation requested. Please provide coordinates or we will use default lat/lng for the city provided.",
        }
      }

      default:
        return {
          tool_call_id: id,
          output: `Error: Tool "${name}" not found.`,
        }
    }
  } catch (err) {
    log.error('TOOL_EXECUTION_FAILED', { name, id, error: String(err) })
    return {
      tool_call_id: id,
      output: `Error during tool execution: ${String(err)}`,
    }
  }
}
