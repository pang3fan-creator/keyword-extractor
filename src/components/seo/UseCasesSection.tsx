import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/utils';

const USE_CASE_KEYS = ['Seo', 'Content', 'Academic', 'Marketing'] as const;

function SeoIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function AcademicIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h6" />
      <path d="M8 11h8" />
    </svg>
  );
}

function MarketingIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

const ICONS: Record<string, React.FC> = {
  Seo: SeoIcon,
  Content: ContentIcon,
  Academic: AcademicIcon,
  Marketing: MarketingIcon,
};

export default async function UseCasesSection() {
  const t = await getTranslations('home');

  return (
    <section className="seo-section" aria-labelledby="use-cases-title">
      <h2 id="use-cases-title">{t('seoUseTitle')}</h2>
      <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-center">{t('seoWhyDesc')}</p>
      <div className="grid gap-6 md:grid-cols-2">
        {USE_CASE_KEYS.map((key, i) => {
          const Icon = ICONS[key];
          return (
            <div
              key={key}
              className={cn(
                'border-border hover:border-primary flex flex-col items-center rounded-xl border p-6 text-center transition hover:shadow-sm',
                i === 0 && 'border-primary',
              )}
            >
              <div className="bg-accent text-primary mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t(`seoUse${key}Title` as never)}</h3>
              <p className="text-muted-foreground text-sm">{t(`seoUse${key}Desc` as never)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
