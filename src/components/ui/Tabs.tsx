'use client';

import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  badge?: string;
  disabled?: boolean;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, className, onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? '');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const active = tabs.find((t) => t.id === activeTab);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-col border-b border-border sm:flex-row" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            className={cn(
              'relative flex items-center gap-1.5 px-4 py-3 text-sm transition-colors',
              activeTab === tab.id
                ? 'rounded-md bg-primary/10 font-semibold text-primary'
                : 'font-medium text-muted hover:text-foreground',
              tab.disabled && 'cursor-not-allowed opacity-60'
            )}
          >
            {tab.label}
            {tab.badge && (
              <span className="ml-1 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        className="mt-4"
      >
        {active?.content}
      </div>
    </div>
  );
}
