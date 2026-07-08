"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { CandidateListingCard } from "@/features/home/components/candidate-listing-card";
import { CandidateFeedTabs } from "@/features/home/components/candidate-feed-tabs";
import { useJobCandidates } from "@/features/home/hooks/use-job-candidates";
import type { CandidateFeedTab } from "@/features/home/types/job-candidates";
import { cn } from "@/lib/utils";

type CandidateFeedProps = {
  selectedCandidateId?: string;
  onSelectCandidate: (candidateId: string | null) => void;
  className?: string;
};

/** Center column candidate feed with tab switcher and listing cards */
export function CandidateFeed({
  selectedCandidateId,
  onSelectCandidate,
  className,
}: CandidateFeedProps) {
  const [activeTab, setActiveTab] = useState<CandidateFeedTab>("locum");
  const { candidates, isLoading, error } = useJobCandidates(activeTab);

  const handleTabChange = (tab: CandidateFeedTab) => {
    setActiveTab(tab);
    onSelectCandidate(null);
  };

  return (
    <section className={cn("flex flex-col gap-5 w-full", className)}>
      <div className="flex items-center justify-between gap-4">
        <CandidateFeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="border-none text-foreground"
          aria-label="Filter jobs"
        >
          <HugeiconsIcon icon={FilterHorizontalIcon} strokeWidth={2} />
        </Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading candidates...
        </p>
      ) : error ? (
        <p className="py-8 text-center text-sm text-destructive">{error}</p>
      ) : candidates.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No candidates found.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {candidates.map((candidate) => (
            <CandidateListingCard
              key={candidate.id}
              candidate={candidate}
              isSelected={candidate.id === selectedCandidateId}
              onSelect={() => onSelectCandidate(candidate.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
