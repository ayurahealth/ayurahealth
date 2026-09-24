import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function isValidHttpsUrl(value?: string): boolean {
  if (!value) return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export async function GET() {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  const directUrl = process.env.DIRECT_URL || process.env.POSTGRES_URL_NON_POOLING

  const envStatus = {
    DATABASE_URL_CONFIGURED: !!dbUrl,
    DIRECT_URL_CONFIGURED: !!directUrl,
    RAW_DATABASE_URL: !!process.env.DATABASE_URL,
    POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_URL_VALID: isValidHttpsUrl(process.env.UPSTASH_REDIS_REST_URL),
    GROQ_API_KEY: !!(
      process.env.GROQ_API_KEY ||
      process.env.GROK_API_KEY ||
      process.env.GROQ_KEY ||
      process.env.GROQ_APIKEY
    ),
    OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
    HUGGINGFACE_API_KEY: !!process.env.HUGGINGFACE_API_KEY,
    CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    RAZORPAY_KEY_ID: !!(process.env.RAZORPAY_KEY_ID || process.env.razorpay_Live_API_Key),
    RAZORPAY_KEY_SECRET: !!(process.env.RAZORPAY_KEY_SECRET || process.env.razorpay_Live_Key_Secret),
  }

  const definedKeys = Object.keys(process.env)
    .filter(k => !k.startsWith('npm_') && !k.startsWith('__') && !k.startsWith('NODE_') && !k.startsWith('VERCEL_') && !k.startsWith('AWS_'))
    .sort()

  return NextResponse.json({
    status: 'diagnostic',
    environment: envStatus,
    configuredVariableNames: definedKeys,
  })
}
