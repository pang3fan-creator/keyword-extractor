'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { BillingPortalButton } from './BillingPortalButton';

type BillingInterval = 'monthly' | 'yearly';

type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'
  | 'expired';

type Subscription = {
  plan: 'pro';
  interval: BillingInterval | null;
  status: SubscriptionStatus;
  provider_customer_id: string | null;
  current_period_end: string | null;
};

type SubscriptionResponse = {
  subscription: Subscription | null;
  isPro: boolean;
};

const STATUS_KEY_LOOKUP: Record<SubscriptionStatus, string> = {
  active: 'active',
  trialing: 'trialing',
  past_due: 'pastDue',
  canceled: 'canceled',
  unpaid: 'unpaid',
  incomplete: 'incomplete',
  incomplete_expired: 'incompleteExpired',
  paused: 'paused',
  expired: 'expired',
};

export function BillingProfilePanel() {
  const t = useTranslations('billing.profile');
  const locale = useLocale();
  const [data, setData] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSubscription() {
      try {
        const response = await fetch('/api/billing/subscription');
        if (!response.ok) {
          throw new Error('Subscription request failed.');
        }

        const payload = (await response.json()) as SubscriptionResponse;
        if (active) setData(payload);
      } catch {
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSubscription();

    return () => {
      active = false;
    };
  }, []);

  const subscription = data?.subscription ?? null;
  const isPro = data?.isPro ?? false;
  const statusKey = subscription ? STATUS_KEY_LOOKUP[subscription.status] : 'none';

  return (
    <section className="billing-profile-panel" aria-label={t('ariaLabel')}>
      <p className="billing-profile-kicker">{t('kicker')}</p>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>

      {loading ? (
        <div className="billing-profile-state" role="status">
          {t('loading')}
        </div>
      ) : failed ? (
        <div className="billing-profile-state billing-profile-state-error" role="status">
          {t('loadError')}
        </div>
      ) : (
        <>
          <div className="subscription-summary">
            <div>
              <span className="subscription-label">{t('subscription.planLabel')}</span>
              <strong>{isPro ? t('subscription.proPlan') : t('subscription.freePlan')}</strong>
            </div>
            <div>
              <span className="subscription-label">{t('subscription.statusLabel')}</span>
              <strong>{t(`subscription.status.${statusKey}` as never)}</strong>
            </div>
            <div>
              <span className="subscription-label">{t('subscription.renewsLabel')}</span>
              <strong>
                {subscription?.current_period_end
                  ? t('subscription.renewsOn', {
                      date: formatDate(subscription.current_period_end, locale),
                    })
                  : t('subscription.notScheduled')}
              </strong>
            </div>
          </div>

          {subscription?.provider_customer_id ? (
            <BillingPortalButton />
          ) : (
            <Link href="/pricing" className="billing-primary-button">
              {t('actions.upgrade')}
            </Link>
          )}
        </>
      )}
    </section>
  );
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}
