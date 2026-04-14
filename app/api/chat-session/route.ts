import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { topic, summary } = body

    if (!topic || !summary) {
      return NextResponse.json({ error: 'Topic and summary are required' }, { status: 400 })
    }

    const session = await prisma.chatSession.create({
      data: {
        userId: user.id,
        topic,
        summary,
      }
    })

    return NextResponse.json({ success: true, session })
  } catch (error) {
    console.error('Error saving chat session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
