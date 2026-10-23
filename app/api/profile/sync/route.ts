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

    // ⚡ Bolt Optimization: Replaced O(N) sequential findFirst/create loop with batched O(1) findMany/createMany
    const memoryContents = memories.map(m => m.content)
    const existingMemories = await prisma.userMemory.findMany({
      where: { userId: user.id, content: { in: memoryContents } },
      select: { content: true }
    })

    const existingContentSet = new Set(existingMemories.map(m => m.content))
    const newMemoriesToCreate = []

    for (const mem of memories) {
      // Prevent both database duplicates and intra-request duplicates
      if (!existingContentSet.has(mem.content)) {
        newMemoriesToCreate.push({
          userId: user.id,
          content: mem.content,
          category: mem.category,
          source: 'HealthProfile Sync'
        })
        existingContentSet.add(mem.content) // Track to avoid intra-request duplicates
      }
    }

    if (newMemoriesToCreate.length > 0) {
      await prisma.userMemory.createMany({
        data: newMemoriesToCreate
      })
    }

    return NextResponse.json({ success: true, message: 'Clinical memory synchronized.' })
  } catch (error) {
    console.error('CRITICAL_SYNC_FAILURE:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
