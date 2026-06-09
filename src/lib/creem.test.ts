import { createHmac } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { normalizeCreemWebhookEvent, verifyCreemSignature } from './creem';

describe('Creem helpers', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('verifies HMAC-SHA256 webhook signatures', () => {
    vi.stubEnv('CREEM_WEBHOOK_SECRET', 'secret');
    const payload = '{"id":"evt_1"}';
    const signature = createHmac('sha256', 'secret').update(payload).digest('hex');

    expect(verifyCreemSignature(payload, signature)).toBe(true);
    expect(verifyCreemSignature(payload, '00')).toBe(false);
  });

  it('normalizes subscription paid events', () => {
    vi.stubEnv('CREEM_PRO_MONTHLY_PRODUCT_ID', 'prod_month');

    expect(
      normalizeCreemWebhookEvent({
        id: 'evt_1',
        eventType: 'subscription.paid',
        object: {
          id: 'sub_123',
          status: 'active',
          current_period_start_date: '2026-06-01T00:00:00.000Z',
          current_period_end_date: '2026-07-01T00:00:00.000Z',
          product: { id: 'prod_month' },
          customer: { id: 'cust_123' },
          metadata: { clerk_user_id: 'user_123' },
        },
      }),
    ).toEqual({
      eventId: 'evt_1',
      eventType: 'subscription.paid',
      checkoutId: null,
      clerkUserId: 'user_123',
      customerId: 'cust_123',
      subscriptionId: 'sub_123',
      productId: 'prod_month',
      interval: 'monthly',
      status: 'active',
      currentPeriodStart: '2026-06-01T00:00:00.000Z',
      currentPeriodEnd: '2026-07-01T00:00:00.000Z',
      canceledAt: null,
    });
  });

  it('normalizes canceled and expired event statuses', () => {
    const canceled = normalizeCreemWebhookEvent({
      id: 'evt_cancel',
      eventType: 'subscription.canceled',
      object: { id: 'sub_123', status: 'active', metadata: { clerk_user_id: 'user_123' } },
    });
    const expired = normalizeCreemWebhookEvent({
      id: 'evt_expire',
      eventType: 'subscription.expired',
      object: { id: 'sub_123', status: 'active', metadata: { clerk_user_id: 'user_123' } },
    });

    expect(canceled?.status).toBe('canceled');
    expect(expired?.status).toBe('expired');
  });
});
