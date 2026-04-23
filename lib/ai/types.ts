/**
 * Shared AI & Agentic Type Definitions
 */

export interface CompletionRequest {
  model: string;
  messages: Message[];
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
}

export interface CompletionResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
}

export interface AgentTraceItem {
  id: 'planner' | 'researcher' | 'synthesizer' | 'governance';
  label: string;
  summary: string;
}

export interface KnowledgeChunkResult {
  title: string;
  content: string;
  tradition: string;
  source: string;
  similarity: number;
}
