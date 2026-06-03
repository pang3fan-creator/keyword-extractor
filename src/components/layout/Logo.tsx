import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'text-xl font-semibold text-foreground transition-colors hover:text-primary hover:no-underline',
        className,
      )}
    >
      ExtractKeywords
    </Link>
  );
}
