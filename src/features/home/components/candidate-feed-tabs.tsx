"use client";

import type { CandidateFeedTab } from "@/features/home/types/feed-candidates";
import { PillTabs } from "@/components/ui/pill-tabs";

type CandidateFeedTabsProps = {
  activeTab: CandidateFeedTab;
  onTabChange: (tab: CandidateFeedTab) => void;
};

const TABS = [
  { id: "locum" as const, label: "Locum Candidates" },
  { id: "permanent" as const, label: "Permanent Candidates" },
];

/** Pill toggle for locum vs permanent candidate feeds */
export function CandidateFeedTabs({
  activeTab,
  onTabChange,
}: CandidateFeedTabsProps) {
  return (
    <PillTabs tabs={TABS} activeTab={activeTab} onTabChange={onTabChange} />
  );
}
