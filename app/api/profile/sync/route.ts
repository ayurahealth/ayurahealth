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

    // ⚡ Bolt: Fix N+1 query in profile sync
    // Batched queries reduce DB roundtrips from O(n) to O(1), significantly lowering latency during sync
    if (memories.length > 0) {
      const existingMemories = await prisma.userMemory.findMany({
        where: {
          userId: user.id,
          content: { in: memories.map(m => m.content) }
        },
        select: { content: true }
      })

      const existingSet = new Set(existingMemories.map(m => m.content))
      const processedSet = new Set<string>()

      const newMemories = memories.filter(mem => {
        // Filter out DB duplicates and intra-request duplicates (Finding #3)
        if (existingSet.has(mem.content) || processedSet.has(mem.content)) {
          return false
        }
        processedSet.add(mem.content)
        return true
      }).map(mem => ({
        userId: user.id,
        content: mem.content,
        category: mem.category,
        source: 'HealthProfile Sync'
      }))

      if (newMemories.length > 0) {
        await prisma.userMemory.createMany({ data: newMemories })
      }
    }

    return NextResponse.json({ success: true, message: 'Clinical memory synchronized.' })
  } catch (error) {
    console.error('CRITICAL_SYNC_FAILURE:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
