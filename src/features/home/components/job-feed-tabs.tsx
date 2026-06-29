"use client";

import type { JobFeedTab } from "@/features/home/mock/home-mock-data";
import { cn } from "@/lib/utils";

type JobFeedTabsProps = {
  activeTab: JobFeedTab;
  onTabChange: (tab: JobFeedTab) => void;
};

const TABS: { id: JobFeedTab; label: string }[] = [
  { id: "locum", label: "Locum Shifts" },
  { id: "permanent", label: "Permanent Jobs" },
];

/** Pill toggle for locum vs permanent job feeds */
export function JobFeedTabs({ activeTab, onTabChange }: JobFeedTabsProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
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
