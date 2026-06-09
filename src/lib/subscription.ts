import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { BillingInterval, CreemSubscriptionStatus, NormalizedCreemSubscription } from './creem';

export type Subscription = {
  id: string;
  clerk_user_id: string;
  plan: 'pro';
  interval: BillingInterval | null;
  status: CreemSubscriptionStatus;
  provider: 'creem';
  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  provider_checkout_id: string | null;
  product_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
};

const ACTIVE_STATUSES = new Set<CreemSubscriptionStatus>(['active', 'trialing']);

export async function getUserSubscription(clerkUserId: string): Promise<Subscription | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('subscriptions')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Subscription | null) ?? null;
}

export async function hasActiveProSubscription(clerkUserId: string | null) {
  if (!clerkUserId) return false;

  try {
    const subscription = await getUserSubscription(clerkUserId);
    return isActiveProSubscription(subscription);
  } catch (error) {
    console.warn('Unable to verify Pro subscription; using free entitlement.', error);
    return false;
  }
}

export function isActiveProSubscription(subscription: Subscription | null) {
  if (!subscription || subscription.plan !== 'pro' || !ACTIVE_STATUSES.has(subscription.status)) {
    return false;
  }

  if (!subscription.current_period_end) return true;
  return new Date(subscription.current_period_end).getTime() > Date.now();
}

export async function processCreemSubscriptionEvent(event: NormalizedCreemSubscription) {
  const supabase = getSupabaseAdmin();
  const { data: existingEvent, error: existingEventError } = await supabase
    .from('payment_events')
    .select('event_id')
    .eq('event_id', event.eventId)
    .maybeSingle();

  if (existingEventError) throw existingEventError;
  if (existingEvent) return { processed: false };

  const { error: eventError } = await supabase.from('payment_events').insert({
    event_id: event.eventId,
    provider: 'creem',
    event_type: event.eventType,
    payload: event,
  });

  if (eventError) throw eventError;

  if (event.clerkUserId && event.subscriptionId) {
    const { error: subscriptionError } = await supabase.from('subscriptions').upsert(
      buildSubscriptionRow(event),
      { onConflict: 'clerk_user_id' },
    );

    if (subscriptionError) throw subscriptionError;
    return { processed: true };
  }

  if (event.subscriptionId) {
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .update(buildSubscriptionUpdate(event))
      .eq('provider', 'creem')
      .eq('provider_subscription_id', event.subscriptionId);

    if (subscriptionError) throw subscriptionError;
  }

  return { processed: true };
}

function buildSubscriptionRow(event: NormalizedCreemSubscription) {
  return {
    clerk_user_id: event.clerkUserId,
    ...buildSubscriptionUpdate(event),
  };
}

function buildSubscriptionUpdate(event: NormalizedCreemSubscription) {
  return {
    plan: 'pro',
    interval: event.interval,
    status: event.status,
    provider: 'creem',
    provider_customer_id: event.customerId,
    provider_subscription_id: event.subscriptionId,
    provider_checkout_id: event.checkoutId,
    product_id: event.productId,
    current_period_start: event.currentPeriodStart,
    current_period_end: event.currentPeriodEnd,
    canceled_at: event.canceledAt,
    updated_at: new Date().toISOString(),
  };
}
