import { getAuth } from '@clerk/nextjs/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCreemCheckout } from '@/lib/creem';
import { getUserSubscription, isActiveProSubscription } from '@/lib/subscription';
import { POST } from './route';

vi.mock('@clerk/nextjs/server', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/lib/creem', () => ({
  createCreemCheckout: vi.fn(),
}));

vi.mock('@/lib/subscription', () => ({
  getUserSubscription: vi.fn(),
  isActiveProSubscription: vi.fn(),
}));

const mockedGetAuth = vi.mocked(getAuth);
const mockedCreateCreemCheckout = vi.mocked(createCreemCheckout);
const mockedGetUserSubscription = vi.mocked(getUserSubscription);
const mockedIsActiveProSubscription = vi.mocked(isActiveProSubscription);

function jsonRequest(body: unknown) {
  return new Request('http://localhost/api/billing/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

describe('POST /api/billing/checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetAuth.mockReturnValue({ userId: 'user_123' } as ReturnType<typeof getAuth>);
    mockedGetUserSubscription.mockResolvedValue(null);
    mockedIsActiveProSubscription.mockReturnValue(false);
  });

  it('requires authentication', async () => {
    mockedGetAuth.mockReturnValue({ userId: null } as ReturnType<typeof getAuth>);

    const response = await POST(jsonRequest({ interval: 'monthly' }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'UNAUTHORIZED',
      error: 'Authentication is required.',
    });
  });

  it('rejects invalid JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/billing/checkout', {
        method: 'POST',
        body: '{',
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'INVALID_JSON',
      error: 'Invalid JSON body.',
    });
  });

  it('rejects invalid billing intervals', async () => {
    const response = await POST(jsonRequest({ interval: 'weekly' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'INVALID_PLAN',
      error: 'A valid billing interval is required.',
    });
  });

  it('returns a checkout URL', async () => {
    mockedCreateCreemCheckout.mockResolvedValue({ checkoutUrl: 'https://creem.io/checkout/123' });

    const response = await POST(jsonRequest({ interval: 'yearly' }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ checkoutUrl: 'https://creem.io/checkout/123' });
    expect(mockedCreateCreemCheckout).toHaveBeenCalledWith({
      interval: 'yearly',
      clerkUserId: 'user_123',
    });
  });

  it('does not create checkout for an active Pro user', async () => {
    mockedGetUserSubscription.mockResolvedValue({
      id: 'row_1',
      clerk_user_id: 'user_123',
      plan: 'pro',
      interval: 'yearly',
      status: 'active',
      provider: 'creem',
      provider_customer_id: 'cust_123',
      provider_subscription_id: 'sub_123',
      provider_checkout_id: null,
      product_id: 'prod_yearly',
      current_period_start: null,
      current_period_end: new Date(Date.now() + 60_000).toISOString(),
      canceled_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    mockedIsActiveProSubscription.mockReturnValue(true);

    const response = await POST(jsonRequest({ interval: 'yearly' }));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'ALREADY_SUBSCRIBED',
      error: 'You already have an active subscription.',
    });
    expect(mockedCreateCreemCheckout).not.toHaveBeenCalled();
  });

  it('fails closed when payment config is missing', async () => {
    mockedCreateCreemCheckout.mockRejectedValue(new Error('CREEM_API_KEY is not configured.'));

    const response = await POST(jsonRequest({ interval: 'monthly' }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'PAYMENT_CONFIG_MISSING',
      error: 'Payment configuration is missing.',
    });
  });
});
