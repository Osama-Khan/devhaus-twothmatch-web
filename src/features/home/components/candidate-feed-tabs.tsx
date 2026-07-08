"use client";

import type { CandidateFeedTab } from "@/features/home/types/job-candidates";
import { cn } from "@/lib/utils";

type CandidateFeedTabsProps = {
  activeTab: CandidateFeedTab;
  onTabChange: (tab: CandidateFeedTab) => void;
};

const TABS: { id: CandidateFeedTab; label: string }[] = [
  { id: "locum", label: "Locum Candidates" },
  { id: "permanent", label: "Permanent Candidates" },
];

/** Pill toggle for locum vs permanent job feeds */
export function CandidateFeedTabs({ activeTab, onTabChange }: CandidateFeedTabsProps) {
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
