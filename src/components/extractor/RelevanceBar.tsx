import { cn } from '@/lib/utils';

interface RelevanceBarProps {
  value: number;
}

export function RelevanceBar({ value }: RelevanceBarProps) {
  const pct = Math.round(value * 100);
  const tier = value >= 0.8 ? 'high' : value >= 0.5 ? 'medium' : 'low';

  return (
    <div className="relevance-cell">
      <div className="relevance-bar">
        <div className={cn('relevance-fill', tier)} style={{ width: `${pct}%` }} />
      </div>
      <span className="relevance-value">{value.toFixed(2)}</span>
    </div>
  );
}
