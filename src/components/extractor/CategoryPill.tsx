import { cn } from '@/lib/utils';

interface CategoryPillProps {
  category: 'topic' | 'service' | 'industry' | 'entity';
}

export function CategoryPill({ category }: CategoryPillProps) {
  return <span className={cn('category-pill', category)}>{category}</span>;
}
