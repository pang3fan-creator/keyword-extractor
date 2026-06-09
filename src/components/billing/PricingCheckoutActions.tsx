'use client';

import { SignInButton, useAuth } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type BillingInterval = 'monthly' | 'yearly';

export function PricingCheckoutActions() {
  const t = useTranslations('pricing');
  const billingT = useTranslations('billing');
  const { isLoaded, isSignedIn } = useAuth();
  const [loadingInterval, setLoadingInterval] = useState<BillingInterval | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  async function startCheckout(interval: BillingInterval) {
    setLoadingInterval(interval);
    setErrorCode(null);

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval }),
      });
      const payload = (await response.json()) as { checkoutUrl?: string; errorCode?: string };

      if (!response.ok || !payload.checkoutUrl) {
        setErrorCode(payload.errorCode ?? 'CHECKOUT_FAILED');
        return;
      }

      window.location.href = payload.checkoutUrl;
    } catch {
      setErrorCode('CHECKOUT_FAILED');
    } finally {
      setLoadingInterval(null);
    }
  }

  if (!isLoaded) {
    return (
      <div className="pricing-checkout-actions">
        <button className="cta cta-disabled" type="button" disabled>
          {t('checkout.loading')}
        </button>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="pricing-checkout-actions">
        <SignInButton mode="modal">
          <button className="cta cta-primary" type="button">
            {t('cards.pro.cta')}
          </button>
        </SignInButton>
        <p className="billing-message">{t('checkout.requiresSignIn')}</p>
      </div>
    );
  }

  return (
    <div className="pricing-checkout-actions">
      <button
        className={cn('cta cta-primary', loadingInterval === 'monthly' && 'loading')}
        disabled={loadingInterval !== null}
        onClick={() => startCheckout('monthly')}
        type="button"
      >
        {loadingInterval === 'monthly' ? t('checkout.redirecting') : t('cards.pro.ctaMonthly')}
      </button>
      <button
        className="cta cta-secondary"
        disabled={loadingInterval !== null}
        onClick={() => startCheckout('yearly')}
        type="button"
      >
        {loadingInterval === 'yearly' ? t('checkout.redirecting') : t('cards.pro.ctaYearly')}
      </button>
      {errorCode && (
        <p className="billing-error">{billingT(`errors.${mapErrorCode(errorCode)}` as never)}</p>
      )}
    </div>
  );
}

function mapErrorCode(errorCode: string) {
  if (errorCode === 'INVALID_PLAN') return 'planUnavailable';
  if (errorCode === 'PAYMENT_CONFIG_MISSING') return 'planUnavailable';
  if (errorCode === 'UNAUTHORIZED') return 'authRequired';
  if (errorCode === 'ALREADY_SUBSCRIBED') return 'alreadySubscribed';
  return 'checkoutFailed';
}
