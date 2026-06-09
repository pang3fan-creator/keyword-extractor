import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  hasActiveProSubscription,
  isActiveProSubscription,
  processCreemSubscriptionEvent,
} from './subscription';

const mockGetSupabaseAdmin = vi.hoisted(() => vi.fn());

vi.mock('@/lib/supabase-admin', () => ({
  getSupabaseAdmin: mockGetSupabaseAdmin,
}));

const baseSubscription = {
  id: 'row_1',
  clerk_user_id: 'user_123',
  plan: 'pro',
  interval: 'monthly',
  provider: 'creem',
  provider_customer_id: 'cust_123',
  provider_subscription_id: 'sub_123',
  provider_checkout_id: null,
  product_id: 'prod_123',
  current_period_start: null,
  canceled_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
} as const;

describe('subscription entitlements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSupabaseAdmin.mockImplementation(() => {
      throw new Error('missing config');
    });
  });

  it('treats active Pro subscriptions as Pro access', () => {
    expect(
      isActiveProSubscription({
        ...baseSubscription,
        status: 'active',
        current_period_end: new Date(Date.now() + 60_000).toISOString(),
      }),
    ).toBe(true);
  });

  it('denies canceled subscriptions', () => {
    expect(
      isActiveProSubscription({
        ...baseSubscription,
        status: 'canceled',
        current_period_end: new Date(Date.now() + 60_000).toISOString(),
      }),
    ).toBe(false);
  });

  it('denies expired active subscriptions', () => {
    expect(
      isActiveProSubscription({
        ...baseSubscription,
        status: 'active',
        current_period_end: new Date(Date.now() - 60_000).toISOString(),
      }),
    ).toBe(false);
  });

  it('fails closed when subscription lookup errors', async () => {
    await expect(hasActiveProSubscription('user_123')).resolves.toBe(false);
  });

  it('upserts current subscription by Clerk user id', async () => {
    const supabase = createSupabaseMock();
    mockGetSupabaseAdmin.mockReturnValue(supabase.client);

    await expect(
      processCreemSubscriptionEvent({
        eventId: 'evt_1',
        eventType: 'subscription.paid',
        checkoutId: null,
        clerkUserId: 'user_123',
        customerId: 'cust_123',
        subscriptionId: 'sub_new',
        productId: 'prod_yearly',
        interval: 'yearly',
        status: 'active',
        currentPeriodStart: '2026-06-09T11:24:19.000Z',
        currentPeriodEnd: '2027-06-09T11:24:19.000Z',
        canceledAt: null,
      }),
    ).resolves.toEqual({ processed: true });

    expect(supabase.subscriptions.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        clerk_user_id: 'user_123',
        provider_subscription_id: 'sub_new',
      }),
      { onConflict: 'clerk_user_id' },
    );
  });

  it('updates existing subscription by provider subscription id when Clerk user id is missing', async () => {
    const supabase = createSupabaseMock();
    mockGetSupabaseAdmin.mockReturnValue(supabase.client);

    await expect(
      processCreemSubscriptionEvent({
        eventId: 'evt_2',
        eventType: 'subscription.canceled',
        checkoutId: null,
        clerkUserId: null,
        customerId: 'cust_123',
        subscriptionId: 'sub_existing',
        productId: 'prod_yearly',
        interval: 'yearly',
        status: 'canceled',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        canceledAt: '2026-06-09T11:30:00.000Z',
      }),
    ).resolves.toEqual({ processed: true });

    expect(supabase.subscriptions.upsert).not.toHaveBeenCalled();
    expect(supabase.subscriptions.update).toHaveBeenCalledWith(
      expect.not.objectContaining({ clerk_user_id: expect.anything() }),
    );
    expect(supabase.subscriptions.eq).toHaveBeenCalledWith('provider', 'creem');
    expect(supabase.subscriptions.eq).toHaveBeenCalledWith(
      'provider_subscription_id',
      'sub_existing',
    );
  });

  it('skips duplicate payment events', async () => {
    const supabase = createSupabaseMock({ existingEvent: true });
    mockGetSupabaseAdmin.mockReturnValue(supabase.client);

    await expect(
      processCreemSubscriptionEvent({
        eventId: 'evt_duplicate',
        eventType: 'subscription.paid',
        checkoutId: null,
        clerkUserId: 'user_123',
        customerId: 'cust_123',
        subscriptionId: 'sub_existing',
        productId: 'prod_yearly',
        interval: 'yearly',
        status: 'active',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        canceledAt: null,
      }),
    ).resolves.toEqual({ processed: false });

    expect(supabase.paymentEvents.insert).not.toHaveBeenCalled();
    expect(supabase.subscriptions.upsert).not.toHaveBeenCalled();
  });
});

function createSupabaseMock(options: { existingEvent?: boolean } = {}) {
  const paymentEvents = {
    select: vi.fn(() => paymentEvents),
    eq: vi.fn(() => paymentEvents),
    maybeSingle: vi.fn().mockResolvedValue({
      data: options.existingEvent ? { event_id: 'evt_duplicate' } : null,
      error: null,
    }),
    insert: vi.fn().mockResolvedValue({ error: null }),
  };
  const subscriptions = {
    upsert: vi.fn().mockResolvedValue({ error: null }),
    update: vi.fn(() => subscriptions),
    eq: vi.fn(() => subscriptions),
  };
  const client = {
    from: vi.fn((table: string) => {
      if (table === 'payment_events') return paymentEvents;
      if (table === 'subscriptions') return subscriptions;
      throw new Error(`Unexpected table: ${table}`);
    }),
  };

  return { client, paymentEvents, subscriptions };
}
