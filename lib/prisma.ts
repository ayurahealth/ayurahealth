import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

export const prisma = globalThis.prismaGlobal ?? 
  (isBuild ? ({} as PrismaClient) : prismaClientSingleton())

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
