import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-static'

export async function POST(req: NextRequest) {
  // ── Rate limit to prevent spam ──────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous'
  const { allowed } = await checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many submissions. Please wait.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { clinicName, contactName, email, phone, tradition, patientCount, message } = body

    // ── Input Validation ──────────────────────────────────────────────────
    if (!clinicName || !contactName || !email) {
      return NextResponse.json({ error: 'Clinic name, contact name, and email are required.' }, { status: 400 })
    }
    
    // Quick email format check
    if (!email.includes('@') || email.length > 254) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const lead = await prisma.clinicLead.create({
      data: {
        clinicName: clinicName.slice(0, 200),
        contactName: contactName.slice(0, 100),
        email: email.slice(0, 254),
        phone: phone ? phone.slice(0, 50) : null,
        tradition: tradition ? tradition.slice(0, 100) : null,
        patientCount: patientCount ? patientCount.slice(0, 50) : null,
        message: message ? message.slice(0, 1000) : null,
      }
    })

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 })
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Failed to submit form'
    console.error('ClinicLead Error:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
