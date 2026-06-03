import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="text-xl font-semibold text-foreground transition-opacity hover:opacity-80">
      ExtractKeywords
    </Link>
  );
}
