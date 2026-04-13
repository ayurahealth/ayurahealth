import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL

  if (!dbUrl) {
    // If we're in build mode, we might not have the DB URL yet
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return {} as PrismaClient
    }
    throw new Error('DATABASE_URL is not set')
  }

  const pool = new Pool({ connectionString: dbUrl })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
