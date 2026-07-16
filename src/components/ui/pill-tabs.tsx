"use client";

import { cn } from "@/lib/utils";

export type PillTabOption<T extends string> = {
  id: T;
  label: string;
};

type PillTabsProps<T extends string> = {
  tabs: readonly PillTabOption<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
};

/**
 * Generic pill toggle for switching between a small set of views.
 * Used by home candidate feed and events tabs.
 */
export function PillTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className,
}: PillTabsProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full rounded-full border border-border bg-card p-1",
        "overflow-x-auto",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
