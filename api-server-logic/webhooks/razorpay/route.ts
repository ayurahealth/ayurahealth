import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      return NextResponse.json({ error: 'Missing security verification.' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // E.g., payment.captured
    if (event.event === 'payment.captured') {
        const paymentEntity = event.payload.payment.entity;
        // UserID should be passed in notes
        const userId = paymentEntity.notes?.userId;
        const purchasedTier = paymentEntity.notes?.tier || 'premium';

        if (userId) {
          const clerk = await clerkClient();
          await clerk.users.updateUserMetadata(userId, {
            publicMetadata: {
              tier: purchasedTier
            }
          });
        }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Razorpay Webhook Error:', errorMsg);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
