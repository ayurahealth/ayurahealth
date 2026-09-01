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

    // Batch create memories using bulk operations to prevent N+1 queries
    if (memories.length > 0) {
      const memoryContents = memories.map(m => m.content)
      const existingMemories = await prisma.userMemory.findMany({
        where: {
          userId: user.id,
          content: { in: memoryContents }
        },
        select: { content: true }
      })

      const existingSet = new Set(existingMemories.map(m => m.content))

      // Deduplicate memories to create (both against DB and intra-payload duplicates)
      const uniqueMemoriesToCreate = memories.reduce((acc, current) => {
        if (!existingSet.has(current.content)) {
          acc.push({
            userId: user.id,
            content: current.content,
            category: current.category,
            source: 'HealthProfile Sync'
          })
          // Add to set to prevent intra-payload duplicates
          existingSet.add(current.content)
        }
        return acc
      }, [] as { userId: string, content: string, category: string, source: string }[])

      if (uniqueMemoriesToCreate.length > 0) {
        await prisma.userMemory.createMany({
          data: uniqueMemoriesToCreate
        })
      }
    }

    return NextResponse.json({ success: true, message: 'Clinical memory synchronized.' })
  } catch (error) {
    console.error('CRITICAL_SYNC_FAILURE:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
