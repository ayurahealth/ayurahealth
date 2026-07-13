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

    // ⚡ Bolt: Replaced N+1 query loop with bulk findMany and createMany
    // Batch create memories (basic unique check by content to avoid duplicates)

    // Find all existing memories for this user that match the incoming content
    const memoryContents = memories.map(m => m.content)
    const existingMemories = await prisma.userMemory.findMany({
      where: {
        userId: user.id,
        content: { in: memoryContents }
      },
      select: { content: true }
    })

    // Create a Set of existing contents for fast O(1) lookups
    const existingContentSet = new Set(existingMemories.map(m => m.content))

    // Deduplicate incoming memories both against DB and within the payload itself
    const newMemoriesToCreate = memories.reduce((acc: { content: string, category: string }[], mem: { content: string, category: string }) => {
      if (!existingContentSet.has(mem.content)) {
        acc.push(mem)
        existingContentSet.add(mem.content) // Prevent intra-payload duplicates
      }
      return acc
    }, [])

    if (newMemoriesToCreate.length > 0) {
      await prisma.userMemory.createMany({
        data: newMemoriesToCreate.map((mem) => ({
          userId: user.id,
          content: mem.content,
          category: mem.category,
          source: 'HealthProfile Sync'
        }))
      })
    }

    return NextResponse.json({ success: true, message: 'Clinical memory synchronized.' })
  } catch (error) {
    console.error('CRITICAL_SYNC_FAILURE:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
