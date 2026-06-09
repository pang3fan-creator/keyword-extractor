import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-errors';
import { getUserSubscription, isActiveProSubscription } from '@/lib/subscription';

export async function GET(request: Request) {
  const { userId } = getAuth(request as Parameters<typeof getAuth>[0]);
  if (!userId) {
    return NextResponse.json(apiError('UNAUTHORIZED'), { status: 401 });
  }

  try {
    const subscription = await getUserSubscription(userId);
    return NextResponse.json({
      subscription,
      isPro: isActiveProSubscription(subscription),
    });
  } catch (error) {
    console.error('Unable to read subscription.', error);
    return NextResponse.json({ subscription: null, isPro: false });
  }
}
