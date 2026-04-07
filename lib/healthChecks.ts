/**
 * Non-sensitive deployment readiness checks for monitoring and launch scripts.
 * Never log or return secret values — only booleans and coarse status.
 */

export type VaidyaCheck = {
  groqConfigured: boolean
  openRouterConfigured: boolean
  ready: boolean
}

function hasEnv(key: string | undefined): boolean {
  return Boolean(key?.trim())
}

export function getVaidyaCheck(): VaidyaCheck {
  const groqConfigured = hasEnv(process.env.GROQ_API_KEY)
  const openRouterConfigured = hasEnv(process.env.OPENROUTER_API_KEY)
  return {
    groqConfigured,
    openRouterConfigured,
    ready: groqConfigured || openRouterConfigured,
  }
}

export type DeepChecks = {
  vaidya: VaidyaCheck
  clerk: {
    publishableConfigured: boolean
    secretConfigured: boolean
  }
  database: 'ok' | 'error' | 'skipped'
  stripe: {
    secretConfigured: boolean
    webhookConfigured: boolean
    publishableConfigured: boolean
  }
  razorpay: {
    keyIdConfigured: boolean
    keySecretConfigured: boolean
  }
  appUrlConfigured: boolean
  huggingfaceEmbeddingsConfigured: boolean
}

export async function getDeepChecks(): Promise<DeepChecks> {
  const vaidya = getVaidyaCheck()

  let database: DeepChecks['database'] = 'skipped'
  if (hasEnv(process.env.DATABASE_URL)) {
    try {
      const { prisma } = await import('./prisma')
      await prisma.$queryRaw`SELECT 1`
      database = 'ok'
    } catch {
      database = 'error'
    }
  }

  return {
    vaidya,
    clerk: {
      publishableConfigured: hasEnv(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
      secretConfigured: hasEnv(process.env.CLERK_SECRET_KEY),
    },
    database,
    stripe: {
      secretConfigured: hasEnv(process.env.STRIPE_SECRET_KEY),
      webhookConfigured: hasEnv(process.env.STRIPE_WEBHOOK_SECRET),
      publishableConfigured: hasEnv(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    },
    razorpay: {
      keyIdConfigured: hasEnv(process.env.RAZORPAY_KEY_ID),
      keySecretConfigured: hasEnv(process.env.RAZORPAY_KEY_SECRET),
    },
    appUrlConfigured: hasEnv(process.env.NEXT_PUBLIC_APP_URL),
    huggingfaceEmbeddingsConfigured: hasEnv(process.env.HUGGINGFACE_API_KEY),
  }
}
