"use client";

import { useState } from "react";
import { CandidateDetailsSidebar } from "@/features/home/components/candidate-details-sidebar";
import { CandidateProfileSidebar } from "@/features/home/components/candidate-profile-sidebar";
import { CandidateFeed } from "@/features/home/components/candidate-feed";
import { useCandidateDetail } from "@/features/candidates/hooks/use-candidate-detail";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const ScrollSpacer = <div className="h-8"></div>;

/** Three-column home dashboard with candidate profile, browse feed, and details */
export function HomeView() {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const { detail, isLoading, error, isPaymentRequired } =
    useCandidateDetail(selectedCandidateId);

  return (
    <main
      className={cn(
        "flex h-full min-h-0 w-full flex-row overflow-hidden",
        // Without candidate selection, the feed handles responsiveness
        selectedCandidateId != null && "mx-auto max-w-7xl px-4"
      )}
    >
      {selectedCandidateId != null && (
        <div className="flex w-70 min-h-0 shrink-0 flex-col">
          <ScrollArea className="h-full">
            {ScrollSpacer}
            <CandidateProfileSidebar
              profile={detail?.profile ?? null}
              isLoading={isLoading && selectedCandidateId != null}
              error={error}
              isPaymentRequired={isPaymentRequired}
            />
            {ScrollSpacer}
          </ScrollArea>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ScrollArea className="h-full w-full">
          {ScrollSpacer}
          <div
            className={cn(
              "px-6",
              // Simulate padding for the left and right columns to maintain scrollability
              // Handle the main view responsive width to keep the scroll max width
              selectedCandidateId == null && "pl-80 pr-90 mx-auto max-w-7xl"
            )}
          >
            <CandidateFeed
              selectedCandidateId={selectedCandidateId ?? undefined}
              onSelectCandidate={setSelectedCandidateId}
            />
          </div>
          {ScrollSpacer}
        </ScrollArea>
      </div>

      {selectedCandidateId != null && (
        <div className="flex w-80 min-h-0 shrink-0 flex-col">
          <ScrollArea className="h-full">
            {ScrollSpacer}
            <CandidateDetailsSidebar
              detail={detail}
              isLoading={isLoading && selectedCandidateId != null}
              error={error}
              isPaymentRequired={isPaymentRequired}
            />
            {ScrollSpacer}
          </ScrollArea>
        </div>
      )}
    </main>
  );
}
