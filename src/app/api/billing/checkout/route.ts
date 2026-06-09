import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-errors';
import { createCreemCheckout, type BillingInterval } from '@/lib/creem';
import { getUserSubscription, isActiveProSubscription } from '@/lib/subscription';

type CheckoutBody = {
  interval?: unknown;
};

export async function POST(request: Request) {
  const { userId } = getAuth(request as Parameters<typeof getAuth>[0]);
  if (!userId) {
    return NextResponse.json(apiError('UNAUTHORIZED'), { status: 401 });
  }

  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(apiError('INVALID_JSON'), { status: 400 });
  }

  if (body.interval !== 'monthly' && body.interval !== 'yearly') {
    return NextResponse.json(apiError('INVALID_PLAN'), { status: 400 });
  }

  try {
    const subscription = await getUserSubscription(userId);
    if (isActiveProSubscription(subscription)) {
      return NextResponse.json(apiError('ALREADY_SUBSCRIBED'), { status: 409 });
    }

    const checkout = await createCreemCheckout({
      interval: body.interval as BillingInterval,
      clerkUserId: userId,
    });
    return NextResponse.json(checkout);
  } catch (error) {
    console.error('Creem checkout failed.', error);
    const errorMessage = error instanceof Error ? error.message : '';
    const errorCode = errorMessage.includes('configured')
      ? 'PAYMENT_CONFIG_MISSING'
      : 'CHECKOUT_FAILED';
    return NextResponse.json(apiError(errorCode), { status: 500 });
  }
}
