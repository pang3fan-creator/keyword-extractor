import { getAuth } from '@clerk/nextjs/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createCreemPortalLink } from '@/lib/creem';
import { getUserSubscription } from '@/lib/subscription';
import { POST } from './route';

vi.mock('@clerk/nextjs/server', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/lib/creem', () => ({
  createCreemPortalLink: vi.fn(),
}));

vi.mock('@/lib/subscription', () => ({
  getUserSubscription: vi.fn(),
}));

const mockedGetAuth = vi.mocked(getAuth);
const mockedCreateCreemPortalLink = vi.mocked(createCreemPortalLink);
const mockedGetUserSubscription = vi.mocked(getUserSubscription);

describe('POST /api/billing/portal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetAuth.mockReturnValue({ userId: 'user_123' } as ReturnType<typeof getAuth>);
  });

  it('requires authentication', async () => {
    mockedGetAuth.mockReturnValue({ userId: null } as ReturnType<typeof getAuth>);

    const response = await POST(new Request('http://localhost/api/billing/portal'));

    expect(response.status).toBe(401);
  });

  it('returns 404 without a billing customer', async () => {
    mockedGetUserSubscription.mockResolvedValue(null);

    const response = await POST(new Request('http://localhost/api/billing/portal'));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'SUBSCRIPTION_NOT_FOUND',
      error: 'No subscription was found.',
    });
  });

  it('returns a customer portal URL', async () => {
    mockedGetUserSubscription.mockResolvedValue({
      id: 'sub_row',
      clerk_user_id: 'user_123',
      plan: 'pro',
      interval: 'monthly',
      status: 'active',
      provider: 'creem',
      provider_customer_id: 'cust_123',
      provider_subscription_id: 'sub_123',
      provider_checkout_id: null,
      product_id: 'prod_123',
      current_period_start: null,
      current_period_end: null,
      canceled_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    mockedCreateCreemPortalLink.mockResolvedValue({ portalUrl: 'https://creem.io/portal/123' });

    const response = await POST(new Request('http://localhost/api/billing/portal'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ portalUrl: 'https://creem.io/portal/123' });
    expect(mockedCreateCreemPortalLink).toHaveBeenCalledWith('cust_123');
  });
});
