import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const t = useTranslations('nav');

  return (
    <nav className="breadcrumb-nav" aria-label={t('breadcrumbNavigation')}>
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="breadcrumb-item" key={`${item.label}-${index}`}>
              {isCurrent || !item.href ? (
                <span className="breadcrumb-current" aria-current={isCurrent ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
              {!isCurrent && (
                <ChevronRight className="breadcrumb-separator" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
