import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function GET() {
  try {
    // 🛡️ Sentinel fix: Fetch by authenticated user to prevent IDOR
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessions = await prisma.chatSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        topic: true,
        summary: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ sessions })
  } catch (err) {
    console.error('FETCH_HISTORY_ERROR:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
