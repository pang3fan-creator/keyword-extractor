import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`font-semibold text-foreground no-underline ${className ?? ''}`}>
      ExtractKeywords
    </Link>
  );
}
