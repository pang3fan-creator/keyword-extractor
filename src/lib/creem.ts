import { createHmac, timingSafeEqual } from 'node:crypto';

export type BillingInterval = 'monthly' | 'yearly';

export type CreemSubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'
  | 'expired';

export type NormalizedCreemSubscription = {
  eventId: string;
  eventType: string;
  checkoutId: string | null;
  clerkUserId: string | null;
  customerId: string | null;
  subscriptionId: string | null;
  productId: string | null;
  interval: BillingInterval | null;
  status: CreemSubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  canceledAt: string | null;
};

type CreemCheckoutResponse = {
  checkout_url?: unknown;
  checkoutUrl?: unknown;
  url?: unknown;
};

type CreemPortalResponse = {
  customer_portal_link?: unknown;
  customerPortalLink?: unknown;
  url?: unknown;
};

type CreemWebhookEvent = {
  id?: unknown;
  eventType?: unknown;
  object?: unknown;
};

const CREEM_PRODUCTION_API_BASE_URL = 'https://api.creem.io';
const CREEM_PROVIDER = 'creem';

export function getCreemProductId(interval: BillingInterval) {
  const envName =
    interval === 'monthly' ? 'CREEM_PRO_MONTHLY_PRODUCT_ID' : 'CREEM_PRO_YEARLY_PRODUCT_ID';
  const productId = process.env[envName];

  if (!productId) {
    throw new Error(`${envName} is not configured.`);
  }

  return productId;
}

export async function createCreemCheckout(input: {
  interval: BillingInterval;
  clerkUserId: string;
}) {
  const apiKey = getCreemApiKey();
  const productId = getCreemProductId(input.interval);
  const response = await fetch(`${getCreemApiBaseUrl()}/v1/checkouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      product_id: productId,
      request_id: `${input.clerkUserId}:${input.interval}:${Date.now()}`,
      success_url: buildAppUrl('/pricing?checkout=success'),
      metadata: {
        clerk_user_id: input.clerkUserId,
        interval: input.interval,
        provider: CREEM_PROVIDER,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Creem checkout failed with ${response.status}.`);
  }

  const payload = (await response.json()) as CreemCheckoutResponse;
  const checkoutUrl = firstString(payload.checkout_url, payload.checkoutUrl, payload.url);
  if (!checkoutUrl) {
    throw new Error('Creem checkout response did not include a checkout URL.');
  }

  return { checkoutUrl };
}

export async function createCreemPortalLink(customerId: string) {
  const response = await fetch(`${getCreemApiBaseUrl()}/v1/customers/billing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': getCreemApiKey(),
    },
    body: JSON.stringify({ customer_id: customerId }),
  });

  if (!response.ok) {
    throw new Error(`Creem billing portal failed with ${response.status}.`);
  }

  const payload = (await response.json()) as CreemPortalResponse;
  const portalUrl = firstString(
    payload.customer_portal_link,
    payload.customerPortalLink,
    payload.url,
  );
  if (!portalUrl) {
    throw new Error('Creem portal response did not include a portal URL.');
  }

  return { portalUrl };
}

export function verifyCreemSignature(payload: string, signature: string | null) {
  const secret = getCreemWebhookSecret();
  if (!signature) return false;

  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  const signatureBuffer = Buffer.from(signature, 'hex');

  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function normalizeCreemWebhookEvent(payload: unknown): NormalizedCreemSubscription | null {
  if (!isRecord(payload)) return null;

  const event = payload as CreemWebhookEvent;
  const eventId = stringOrNull(event.id);
  const eventType = stringOrNull(event.eventType);
  if (!eventId || !eventType || !isRecord(event.object)) return null;

  if (
    eventType !== 'checkout.completed' &&
    eventType !== 'subscription.active' &&
    eventType !== 'subscription.paid' &&
    eventType !== 'subscription.canceled' &&
    eventType !== 'subscription.expired' &&
    eventType !== 'subscription.update'
  ) {
    return null;
  }

  const object = event.object;
  const checkout = eventType === 'checkout.completed' ? object : null;
  const subscription = isRecord(object.subscription) ? object.subscription : object;
  const product = isRecord(subscription.product)
    ? subscription.product
    : isRecord(object.product)
      ? object.product
      : null;
  const customer = isRecord(subscription.customer)
    ? subscription.customer
    : isRecord(object.customer)
      ? object.customer
      : null;
  const metadata = isRecord(subscription.metadata)
    ? subscription.metadata
    : isRecord(object.metadata)
      ? object.metadata
      : null;

  const productId = stringOrNull(product?.id) ?? stringOrNull(subscription.product);
  const interval =
    stringOrNull(metadata?.interval) === 'monthly' || stringOrNull(metadata?.interval) === 'yearly'
      ? (stringOrNull(metadata?.interval) as BillingInterval)
      : getIntervalFromProductId(productId);

  return {
    eventId,
    eventType,
    checkoutId: checkout ? stringOrNull(checkout.id) : null,
    clerkUserId: stringOrNull(metadata?.clerk_user_id),
    customerId: stringOrNull(customer?.id) ?? stringOrNull(subscription.customer),
    subscriptionId: stringOrNull(subscription.id),
    productId,
    interval,
    status: getSubscriptionStatus(eventType, stringOrNull(subscription.status)),
    currentPeriodStart: stringOrNull(subscription.current_period_start_date),
    currentPeriodEnd:
      stringOrNull(subscription.current_period_end_date) ??
      stringOrNull(subscription.next_transaction_date),
    canceledAt: stringOrNull(subscription.canceled_at),
  };
}

function getCreemApiKey() {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) throw new Error('CREEM_API_KEY is not configured.');
  return apiKey;
}

function getCreemApiBaseUrl() {
  return process.env.CREEM_API_BASE_URL?.replace(/\/$/, '') ?? CREEM_PRODUCTION_API_BASE_URL;
}

function getCreemWebhookSecret() {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) throw new Error('CREEM_WEBHOOK_SECRET is not configured.');
  return secret;
}

function buildAppUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
  return `${baseUrl}${path}`;
}

function firstString(...values: unknown[]) {
  return values.find((value): value is string => typeof value === 'string' && value.length > 0);
}

function stringOrNull(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function getIntervalFromProductId(productId: string | null): BillingInterval | null {
  if (!productId) return null;
  if (productId === process.env.CREEM_PRO_MONTHLY_PRODUCT_ID) return 'monthly';
  if (productId === process.env.CREEM_PRO_YEARLY_PRODUCT_ID) return 'yearly';
  return null;
}

function getSubscriptionStatus(
  eventType: string,
  status: string | null,
): CreemSubscriptionStatus {
  if (eventType === 'subscription.canceled') return 'canceled';
  if (eventType === 'subscription.expired') return 'expired';
  if (
    status === 'active' ||
    status === 'trialing' ||
    status === 'past_due' ||
    status === 'canceled' ||
    status === 'unpaid' ||
    status === 'incomplete' ||
    status === 'incomplete_expired' ||
    status === 'paused' ||
    status === 'expired'
  ) {
    return status;
  }

  return 'active';
}
