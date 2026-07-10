"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CandidateListingCard } from "@/features/home/components/candidate-listing-card";
import { CandidateFeedSkeleton } from "@/features/home/components/candidate-listing-card-skeleton";
import { CandidateFeedTabs } from "@/features/home/components/candidate-feed-tabs";
import { CandidateFeedFiltersButton } from "@/features/home/components/candidate-feed-filters-button";
import { useFeedCandidates } from "@/features/home/hooks/use-feed-candidates";
import type {
  CandidateFeedFilters,
  CandidateFeedTab,
} from "@/features/home/types/feed-candidates";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserSearchIcon } from "@hugeicons/core-free-icons";

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
  const [filters, setFilters] = useState<CandidateFeedFilters | null>(null);
  const { candidates, isLoading, isLoadingMore, error, hasMore, loadMore } =
    useFeedCandidates(activeTab, filters);

  const handleTabChange = (tab: CandidateFeedTab) => {
    setActiveTab(tab);
    onSelectCandidate(null);

    if (filters) {
      const nextFilters: CandidateFeedFilters = { ...filters };
      delete nextFilters.payRangeMin;
      delete nextFilters.payRangeMax;
      setFilters(Object.keys(nextFilters).length > 0 ? nextFilters : null);
    }
  };

  return (
    <section className={cn("flex flex-col gap-5 w-full relative", className)}>
      <div className="sticky top-0 w-full h-0 -mb-5 overflow-visible z-5">
        <div className="h-24 from-background/90 from-50% via-background/90 to-background/0 bg-linear-to-b"></div>
      </div>
      <div className="flex items-center justify-between gap-4 sticky top-8 z-10">
        <CandidateFeedTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <CandidateFeedFiltersButton
          activeTab={activeTab}
          value={filters}
          onChange={setFilters}
        />
      </div>

      {isLoading ? (
        <CandidateFeedSkeleton />
      ) : error && candidates.length === 0 ? (
        <p className="py-8 text-center text-sm text-destructive">{error}</p>
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12">
          <span className="text-[46px] text-muted-foreground flex items-center justify-center">
            <HugeiconsIcon
              icon={UserSearchIcon}
              strokeWidth={2}
              className="size-14 text-primary"
            />
          </span>
          <span className="text-center text-base text-muted-foreground font-medium">
            No candidates found.
          </span>
          <Button
            type="button"
            variant="default"
            className="mt-2"
            onClick={() => setFilters(null)}
          >
            Reset Filters
          </Button>
        </div>
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

          {error ? (
            <p className="text-center text-sm text-destructive">{error}</p>
          ) : null}

          {hasMore ? (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="link"
                className="h-auto py-0 text-sm font-semibold"
                disabled={isLoadingMore}
                onClick={loadMore}
              >
                {isLoadingMore ? "Loading…" : "Load more"}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
