import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const dbUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL

  // Support Vercel Postgres/Supabase env naming when DATABASE_URL isn't set.
  if (!process.env.DATABASE_URL && dbUrl) {
    process.env.DATABASE_URL = dbUrl
  }

  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

export const prisma = globalThis.prismaGlobal ?? 
  (isBuild ? ({} as PrismaClient) : prismaClientSingleton())

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
