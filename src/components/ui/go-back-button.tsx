'use client';

export function GoBackButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="border-border bg-card hover:border-muted-foreground hover:bg-background inline-flex items-center gap-1.5 rounded-lg border text-[15px] font-medium transition"
      style={{ color: 'var(--foreground)', padding: '12px 24px' }}
      onClick={() => window.history.back()}
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
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      {label}
    </button>
  );
}
