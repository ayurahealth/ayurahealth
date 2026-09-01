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

    // Batch create memories (basic unique check by content to avoid duplicates)
    if (memories.length > 0) {
      // 1. Fetch existing memories to avoid N+1 queries
      const contents = memories.map(m => m.content)
      const existing = await prisma.userMemory.findMany({
        where: {
          userId: user.id,
          content: { in: contents }
        },
        select: { content: true }
      })
      const existingSet = new Set(existing.map(e => e.content))

      // 2. Filter new memories and prevent intra-payload duplicates
      const newMemories = memories.reduce<{ userId: string; content: string; category: string; source: string }[]>((acc, mem) => {
        if (!existingSet.has(mem.content)) {
          existingSet.add(mem.content) // update set to catch duplicates within the incoming array itself
          acc.push({
            userId: user.id,
            content: mem.content,
            category: mem.category,
            source: 'HealthProfile Sync'
          })
        }
        return acc
      }, [])

      // 3. Bulk insert
      if (newMemories.length > 0) {
        await prisma.userMemory.createMany({
          data: newMemories
        })
      }
    }

    return NextResponse.json({ success: true, message: 'Clinical memory synchronized.' })
  } catch (error) {
    console.error('CRITICAL_SYNC_FAILURE:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
