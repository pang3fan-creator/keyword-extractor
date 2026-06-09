import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-errors';
import { normalizeCreemWebhookEvent, verifyCreemSignature } from '@/lib/creem';
import { processCreemSubscriptionEvent } from '@/lib/subscription';

export async function POST(request: Request) {
  const payload = await request.text();

  try {
    if (!verifyCreemSignature(payload, request.headers.get('creem-signature'))) {
      return NextResponse.json(apiError('WEBHOOK_SIGNATURE_INVALID'), { status: 401 });
    }
  } catch (error) {
    console.error('Unable to verify Creem webhook signature.', error);
    return NextResponse.json(apiError('PAYMENT_CONFIG_MISSING'), { status: 500 });
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(payload);
  } catch {
    return NextResponse.json(apiError('INVALID_JSON'), { status: 400 });
  }

  const event = normalizeCreemWebhookEvent(parsedPayload);
  if (!event) {
    return NextResponse.json({ received: true, ignored: true });
  }

  try {
    const result = await processCreemSubscriptionEvent(event);
    return NextResponse.json({ received: true, ...result });
  } catch (error) {
    console.error('Unable to process Creem webhook.', error);
    return NextResponse.json(apiError('WEBHOOK_PROCESSING_FAILED'), { status: 500 });
  }
}
