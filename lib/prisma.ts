import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

let globalPool: Pool | undefined

const prismaClientSingleton = () => {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL

  if (!dbUrl) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return {} as PrismaClient
    }
    throw new Error('DATABASE_URL is not set')
  }

  // Reuse existing pool if available to prevent leaks (Finding #8)
  const pool = globalPool || new Pool({ connectionString: dbUrl })
  globalPool = pool
  
  const adapter = new PrismaPg(pool)
  const client = new PrismaClient({ adapter })

  // Override disconnect to coordinate pool shutdown
  const originalDisconnect = client.$disconnect.bind(client)
  client.$disconnect = async () => {
    await originalDisconnect()
    if (globalPool) {
      await globalPool.end()
      globalPool = undefined
    }
  }

  return client
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? (prismaClientSingleton() as PrismaClient)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
