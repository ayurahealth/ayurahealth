import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  // Verify the payload with the headers
  const evt = ((): WebhookEvent | null => {
    try {
      return wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch {
      return null;
    }
  })();

  if (!evt) return new Response("Error", { status: 400 });

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data

    const primaryEmail = email_addresses && email_addresses.length > 0 
      ? email_addresses[0].email_address 
      : 'unknown@example.com'

    // Use upsert to handle case where profile route might have already created the user
    await prisma.userProfile.upsert({
      where: { id },
      update: {
        email: primaryEmail,
      },
      create: {
        id: id,
        email: primaryEmail,
      }
    })

    console.log(`Webhook with an ID of ${id} and type of ${eventType} processed: User registered`)
  }

  return new Response('', { status: 200 })
}
