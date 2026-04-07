import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { prisma } from '../../../lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'

const userProfileSchema = z.object({
  primaryDosha: z.string().optional(),
  vataScore: z.number().int().optional(),
  pittaScore: z.number().int().optional(),
  kaphaScore: z.number().int().optional(),
  age: z.union([z.string(), z.number()]).optional(),
  gender: z.string().optional(),
  healthGoal: z.string().optional(),
  conditions: z.array(z.string()).optional(),
})

// Fetch the user's Health Profile
export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.userProfile.findUnique({
      where: { id: user.id },
      include: {
        chatSessions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        }
      }
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Update the user's Health Profile (e.g. after a Quiz or AI Chat)
export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validation = userProfileSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data', details: validation.error.format() }, { status: 400 })
    }

    const { primaryDosha, vataScore, pittaScore, kaphaScore, age, gender, healthGoal, conditions } = validation.data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedProfile = await (prisma as any).userProfile.upsert({
      where: { id: user.id },
      update: {
        primaryDosha,
        vataScore,
        pittaScore,
        kaphaScore,
        age: age ? parseInt(age.toString()) : undefined,
        gender,
        healthGoal,
        conditions,
      },
      create: {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || 'unknown@example.com',
        primaryDosha,
        vataScore,
        pittaScore,
        kaphaScore,
        age: age ? parseInt(age.toString()) : undefined,
        gender,
        healthGoal,
        conditions: conditions || [],
      }
    })

    return NextResponse.json({ success: true, profile: updatedProfile })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
