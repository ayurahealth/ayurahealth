import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

/**
 * AYURA INTELLIGENCE CLINICAL MEMORY SYNC
 * Takes the local HealthProfile and persists it to UserProfile and UserMemory tables.
 */
export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await req.json()

    // 1. Update the core UserProfile
    await prisma.userProfile.upsert({
      where: { id: user.id },
      update: {
        conditions: profile.conditions || [],
        healthGoal: profile.goals?.[0] || undefined,
      },
      create: {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || 'unknown@ayurahealth.com',
        conditions: profile.conditions || [],
        healthGoal: profile.goals?.[0] || undefined,
        subscriptionStatus: 'free'
      }
    })

    // 2. Persist lifestyle markers as "UserMemory" for VAIDYA's clinical context
    const memories = [
      ...(profile.medications || []).map((m: string) => ({ content: `User takes medication: ${m}`, category: 'Medical' })),
      ...(profile.allergies || []).map((a: string) => ({ content: `User has allergy: ${a}`, category: 'Medical' })),
      ...(profile.whatWorked || []).map((w: string) => ({ content: `Treatment that worked: ${w}`, category: 'Clinical Insight' })),
    ]

    if (profile.lifestyle?.diet) {
      memories.push({ content: `User follows ${profile.lifestyle.diet} diet`, category: 'Lifestyle' })
    }

    // ⚡ Bolt Performance Optimization
    // Replaced N+1 queries with a batched findMany and createMany for memory synchronization
    // Expected impact: Reduces database queries from O(N) to O(1), improving sync time for large profiles
    if (memories.length > 0) {
      const existingMemories = await prisma.userMemory.findMany({
        where: {
          userId: user.id,
          content: { in: memories.map((m: { content: string }) => m.content) }
        },
        select: { content: true }
      })

      const existingContents = new Set(existingMemories.map((m: { content: string }) => m.content))
      const intraRequestDuplicates = new Set()
      const newMemoriesToCreate = []

      for (const mem of memories) {
        if (!existingContents.has(mem.content) && !intraRequestDuplicates.has(mem.content)) {
          intraRequestDuplicates.add(mem.content)
          newMemoriesToCreate.push({
            userId: user.id,
            content: mem.content,
            category: mem.category,
            source: 'HealthProfile Sync'
          })
        }
      }

      if (newMemoriesToCreate.length > 0) {
        await prisma.userMemory.createMany({
          data: newMemoriesToCreate
        })
      }
    }

    return NextResponse.json({ success: true, message: 'Clinical memory synchronized.' })
  } catch (error) {
    console.error('CRITICAL_SYNC_FAILURE:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
