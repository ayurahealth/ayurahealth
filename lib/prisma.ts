import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const createPrismaClient = () => {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  if (!connectionString) {
    console.warn('⚠️ WARNING: DATABASE_URL / POSTGRES_PRISMA_URL is not set. Prisma operations will fail if executed.');

    // Pass a dummy connection string instead of no adapter to bypass Prisma 7 validation
    // The client will fail if actually used, which matches the previous behavior.
    const pool = new pg.Pool({ connectionString: 'postgres://dummy:dummy@localhost:5432/dummy' })
    const adapter = new PrismaPg(pool)

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error'] : [],
    });
  }

  const pool = new pg.Pool({ 
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
