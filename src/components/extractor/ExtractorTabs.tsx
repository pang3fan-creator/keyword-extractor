'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

interface Tab {
  id: string;
  label: string;
  badge?: string;
  disabled?: boolean;
  content: React.ReactNode;
}

interface ExtractorTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function ExtractorTabs({ tabs, defaultTab, onTabChange }: ExtractorTabsProps) {
  const [value, setValue] = useState(defaultTab ?? tabs[0]?.id ?? '');

  const handleChange = (v: string) => {
    setValue(v);
    onTabChange?.(v);
  };

  return (
    <Tabs value={value} onValueChange={handleChange}>
      <TabsList className="w-full flex-col sm:flex-row">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} disabled={tab.disabled}>
            {tab.label}
            {tab.badge && (
              <span className="ml-1.5 rounded bg-amber-500 px-1 py-0.5 text-[10px] font-bold text-white">
                {tab.badge}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
