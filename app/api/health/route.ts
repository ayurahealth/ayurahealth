import { NextResponse } from 'next/server'
import { ollamaProvider } from '@/lib/ai/providers/ollama'
import { groqProvider } from '@/lib/ai/providers/groq'
import { openRouterProvider } from '@/lib/ai/providers/openrouter'
import { huggingFaceProvider } from '@/lib/ai/providers/huggingface'

export const dynamic = 'force-dynamic'

export async function GET() {
  const envStatus = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DIRECT_URL: !!process.env.DIRECT_URL,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    GROQ_API_KEY: !!process.env.GROQ_API_KEY,
    OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
    HUGGINGFACE_API_KEY: !!process.env.HUGGINGFACE_API_KEY,
    CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    UPSTASH_REDIS_REST_URL_VALUE_STARTS_WITH_HTTP: process.env.UPSTASH_REDIS_REST_URL?.startsWith('http'),
  }

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: envStatus,
  })
}
