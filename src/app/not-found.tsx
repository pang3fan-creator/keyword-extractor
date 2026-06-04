import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { GoBackButton } from '@/components/ui/go-back-button';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div
        className="flex flex-col items-center text-center"
        style={{ maxWidth: 520, gap: '2.5rem' }}
      >
        <div
          className="text-primary leading-none font-bold tracking-tight"
          style={{ fontSize: 'clamp(96px, 20vw, 160px)', letterSpacing: '-0.04em' }}
        >
          404
        </div>
        <div className="text-muted-foreground text-[13px] font-[var(--font-mono)] tracking-[0.12em] uppercase">
          {t('subtitle')}
        </div>
        <h1
          className="font-semibold tracking-tight"
          style={{ fontSize: 'clamp(20px, 4vw, 28px)', letterSpacing: '-0.02em' }}
        >
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-[15px] leading-relaxed">{t('desc')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-primary inline-flex items-center gap-2 rounded-lg text-[15px] font-medium no-underline transition hover:-translate-y-px hover:opacity-85 active:translate-y-0"
            style={{ color: '#fff', padding: '12px 28px' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12h2v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7h2" />
              <path d="M12 3 3 12h3v2h12v-2h3z" />
              <path d="M10 15h4v5h-4z" />
            </svg>
            {t('goHome')}
          </Link>
          <GoBackButton label={t('goBack')} />
        </div>
        <div className="text-border text-[13px] font-[var(--font-mono)]">ExtractKeywords</div>
      </div>
    </div>
  );
}
