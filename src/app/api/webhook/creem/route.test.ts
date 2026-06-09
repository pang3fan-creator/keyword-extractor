import { beforeEach, describe, expect, it, vi } from 'vitest';
import { normalizeCreemWebhookEvent, verifyCreemSignature } from '@/lib/creem';
import { processCreemSubscriptionEvent } from '@/lib/subscription';
import { POST } from './route';

vi.mock('@/lib/creem', () => ({
  normalizeCreemWebhookEvent: vi.fn(),
  verifyCreemSignature: vi.fn(),
}));

vi.mock('@/lib/subscription', () => ({
  processCreemSubscriptionEvent: vi.fn(),
}));

const mockedVerifyCreemSignature = vi.mocked(verifyCreemSignature);
const mockedNormalizeCreemWebhookEvent = vi.mocked(normalizeCreemWebhookEvent);
const mockedProcessCreemSubscriptionEvent = vi.mocked(processCreemSubscriptionEvent);

function webhookRequest(body: string, signature = 'sig') {
  return new Request('http://localhost/api/webhook/creem', {
    method: 'POST',
    headers: { 'creem-signature': signature },
    body,
  });
}

describe('POST /api/webhook/creem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedVerifyCreemSignature.mockReturnValue(true);
  });

  it('rejects invalid signatures', async () => {
    mockedVerifyCreemSignature.mockReturnValue(false);

    const response = await POST(webhookRequest('{"id":"evt_1"}'));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'WEBHOOK_SIGNATURE_INVALID',
      error: 'Invalid webhook signature.',
    });
    expect(mockedNormalizeCreemWebhookEvent).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON after a valid signature', async () => {
    const response = await POST(webhookRequest('{'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      errorCode: 'INVALID_JSON',
      error: 'Invalid JSON body.',
    });
  });

  it('acknowledges ignored event types', async () => {
    mockedNormalizeCreemWebhookEvent.mockReturnValue(null);

    const response = await POST(webhookRequest('{"eventType":"refund.created"}'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: true, ignored: true });
  });

  it('processes subscription events idempotently', async () => {
    const event = {
      eventId: 'evt_1',
      eventType: 'subscription.paid',
      checkoutId: null,
      clerkUserId: 'user_123',
      customerId: 'cust_123',
      subscriptionId: 'sub_123',
      productId: 'prod_123',
      interval: 'monthly',
      status: 'active',
      currentPeriodStart: null,
      currentPeriodEnd: null,
      canceledAt: null,
    } as const;
    mockedNormalizeCreemWebhookEvent.mockReturnValue(event);
    mockedProcessCreemSubscriptionEvent.mockResolvedValue({ processed: false });

    const response = await POST(webhookRequest('{"eventType":"subscription.paid"}'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ received: true, processed: false });
    expect(mockedProcessCreemSubscriptionEvent).toHaveBeenCalledWith(event);
  });
});
