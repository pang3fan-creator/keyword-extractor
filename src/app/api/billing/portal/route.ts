import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-errors';
import { createCreemPortalLink } from '@/lib/creem';
import { getUserSubscription } from '@/lib/subscription';

export async function POST(request: Request) {
  const { userId } = getAuth(request as Parameters<typeof getAuth>[0]);
  if (!userId) {
    return NextResponse.json(apiError('UNAUTHORIZED'), { status: 401 });
  }

  try {
    const subscription = await getUserSubscription(userId);
    if (!subscription?.provider_customer_id) {
      return NextResponse.json(apiError('SUBSCRIPTION_NOT_FOUND'), { status: 404 });
    }

    const portal = await createCreemPortalLink(subscription.provider_customer_id);
    return NextResponse.json(portal);
  } catch (error) {
    console.error('Creem billing portal failed.', error);
    const errorMessage = error instanceof Error ? error.message : '';
    const errorCode = errorMessage.includes('configured') ? 'PAYMENT_CONFIG_MISSING' : 'PORTAL_FAILED';
    return NextResponse.json(apiError(errorCode), { status: 500 });
  }
}
