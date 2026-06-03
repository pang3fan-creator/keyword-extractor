import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('logo', className)}>
      ExtractKeywords
    </Link>
  );
}
