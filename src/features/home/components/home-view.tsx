"use client";

import { useState } from "react";
import { CandidateDetailsSidebar } from "@/features/home/components/candidate-details-sidebar";
import { CandidateProfileSidebar } from "@/features/home/components/candidate-profile-sidebar";
import { JobFeed } from "@/features/home/components/job-feed";
import { useCandidateDetail } from "@/features/candidates/hooks/use-candidate-detail";
import { ScrollArea } from "@/components/ui/scroll-area";

const ScrollSpacer = <div className="h-8"></div>;

/** Three-column home dashboard with candidate profile, browse feed, and details */
export function HomeView() {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const { detail, isLoading, error } = useCandidateDetail(selectedCandidateId);

  return (
    <main className="mx-auto flex h-full min-h-0 max-w-7xl flex-row overflow-hidden px-4">
      <div className="flex w-70 min-h-0 shrink-0 flex-col">
        <ScrollArea className="h-full">
          {ScrollSpacer}
          <CandidateProfileSidebar
            profile={detail?.profile ?? null}
            isLoading={isLoading && selectedCandidateId != null}
            error={error}
          />
          {ScrollSpacer}
        </ScrollArea>
      </div>

      <div className="flex min-h-0 flex-1 shrink-0 grow flex-col">
        <ScrollArea className="h-full w-full grow">
          {ScrollSpacer}
          <div className="w-full px-6">
            <JobFeed
              selectedCandidateId={selectedCandidateId ?? undefined}
              onSelectCandidate={setSelectedCandidateId}
            />
          </div>
          {ScrollSpacer}
        </ScrollArea>
      </div>

      <div className="flex w-80 min-h-0 shrink-0 flex-col">
        <ScrollArea className="h-full">
          {ScrollSpacer}
          <CandidateDetailsSidebar
            detail={detail}
            isLoading={isLoading && selectedCandidateId != null}
            error={error}
          />
          {ScrollSpacer}
        </ScrollArea>
      </div>
    </main>
  );
}
