'use client';

import { useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type GatedVariant = 'sign-in' | 'upgrade';

interface AIGatedPanelProps {
  variant: GatedVariant;
}

export function AIGatedPanel({ variant }: AIGatedPanelProps) {
  const t = useTranslations('home');
  const { openSignIn } = useClerk();

  const isSignIn = variant === 'sign-in';
  const title = t(isSignIn ? 'ai.signInTitle' : 'ai.upgradeTitle');
  const desc = t(isSignIn ? 'ai.signInDesc' : 'ai.upgradeDesc');

  return (
    <div className="ai-gated-panel">
      <div className="icon">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h3 className="title">{title}</h3>
      <p className="desc">{desc}</p>
      {isSignIn ? (
        <button className="btn" onClick={() => openSignIn()} type="button">
          {t('ai.signInButton')}
        </button>
      ) : (
        <Link href="/pricing" className="btn">
          {t('ai.upgradeButton')}
        </Link>
      )}
    </div>
  );
}
