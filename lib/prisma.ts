import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL

  // Support Vercel Postgres/Supabase env naming
  if (!process.env.DATABASE_URL && dbUrl) {
    process.env.DATABASE_URL = dbUrl
  }

  // Prisma 7 strictly REQUIRES an adapter. 
  // We provide a dummy pool if the URL is missing during Vercel's build step.
  const pool = dbUrl ? new Pool({ connectionString: dbUrl }) : new Pool()
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
