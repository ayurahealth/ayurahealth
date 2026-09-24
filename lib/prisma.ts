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
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error'] : [],
    });
  }

  let poolConnectionString = connectionString
  let ssl: { ca: string; rejectUnauthorized: true } | undefined
  if (process.env.DATABASE_SSL_CA_CERT) {
    // pg-connection-string replaces the `ssl` object when SSL parameters remain
    // in the URL. Use the explicitly configured Supabase CA for verification.
    const parsed = new URL(connectionString)
    for (const key of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey']) {
      parsed.searchParams.delete(key)
    }
    poolConnectionString = parsed.toString()
    ssl = { ca: process.env.DATABASE_SSL_CA_CERT, rejectUnauthorized: true }
  }

  const pool = new pg.Pool({
    connectionString: poolConnectionString,
    ...(ssl ? { ssl } : {}),
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
