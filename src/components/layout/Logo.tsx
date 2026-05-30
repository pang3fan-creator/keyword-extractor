import Link from 'next/link';

export function LogoIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" className="fill-primary dark:fill-primary" />
      <circle cx="13" cy="14" r="5.5" stroke="white" strokeWidth="2.5" fill="none" />
      <line x1="17" y1="18" x2="21.5" y2="22.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="8" x2="27" y2="8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="12" x2="25" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 font-semibold text-foreground no-underline ${className ?? ''}`}>
      <LogoIcon />
      <span className="text-lg tracking-tight">ExtractKeywords</span>
    </Link>
  );
}
