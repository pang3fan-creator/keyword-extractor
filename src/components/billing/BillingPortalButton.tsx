'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function BillingPortalButton({ disabled = false }: { disabled?: boolean }) {
  const t = useTranslations('billing.profile');
  const billingT = useTranslations('billing');
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  async function openPortal() {
    setLoading(true);
    setErrorCode(null);

    try {
      const response = await fetch('/api/billing/portal', { method: 'POST' });
      const payload = (await response.json()) as { portalUrl?: string; errorCode?: string };

      if (!response.ok || !payload.portalUrl) {
        setErrorCode(payload.errorCode ?? 'PORTAL_FAILED');
        return;
      }

      window.location.href = payload.portalUrl;
    } catch {
      setErrorCode('PORTAL_FAILED');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="billing-action-stack">
      <button
        className={cn('billing-primary-button', loading && 'loading')}
        disabled={disabled || loading}
        onClick={openPortal}
        type="button"
      >
        {loading ? t('actions.openingPortal') : t('actions.manageBilling')}
      </button>
      {errorCode && (
        <p className="billing-error">{billingT(`errors.${mapErrorCode(errorCode)}` as never)}</p>
      )}
    </div>
  );
}

function mapErrorCode(errorCode: string) {
  if (errorCode === 'SUBSCRIPTION_NOT_FOUND') return 'subscriptionNotFound';
  if (errorCode === 'PAYMENT_CONFIG_MISSING') return 'planUnavailable';
  if (errorCode === 'UNAUTHORIZED') return 'authRequired';
  return 'portalFailed';
}
