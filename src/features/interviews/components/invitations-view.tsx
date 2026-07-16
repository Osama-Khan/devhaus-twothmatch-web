"use client";

import { useCallback, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserStar01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InterviewListingCard } from "@/features/interviews/components/interview-listing-card";
import { InterviewListingCardSkeleton } from "@/features/interviews/components/interview-listing-card-skeleton";
import { useInterviews } from "@/features/interviews/hooks/use-interviews";
import { useRescheduleRequests } from "@/features/interviews/hooks/use-reschedule-requests";
import type { Interview, InterviewStatus } from "@/features/interviews/types";
import {
  formatInterviewRequestsLabel,
  formatInterviewStatusLabel,
} from "@/features/interviews/utils/format-interview-display";
import { cn } from "@/lib/utils";

type InvitationsTab = InterviewStatus | "requests";

const STATUS_TABS = [
  { id: "confirmed" as const, label: formatInterviewStatusLabel("confirmed") },
  { id: "pending" as const, label: formatInterviewStatusLabel("pending") },
  { id: "requests" as const, label: formatInterviewRequestsLabel() },
  { id: "completed" as const, label: formatInterviewStatusLabel("completed") },
  { id: "cancelled" as const, label: formatInterviewStatusLabel("cancelled") },
];

type InvitationsViewProps = {
  className?: string;
};

/** Authenticated invitations page with status filter and interview cards */
export function InvitationsView({ className }: InvitationsViewProps) {
  const [tab, setTab] = useState<InvitationsTab>("confirmed");
  const isRequests = tab === "requests";

  const statusList = useInterviews({
    status: isRequests ? "confirmed" : tab,
    enabled: !isRequests,
  });
  const requestsList = useRescheduleRequests({ enabled: isRequests });

  const active = isRequests ? requestsList : statusList;
  const {
    interviews,
    role,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    upsertInterview,
    removeInterview,
  } = active;

  const handleCancelled = useCallback(
    (interview: Interview) => {
      if (isRequests || interview.status !== tab) {
        removeInterview(interview.id);
        return;
      }
      upsertInterview(interview);
    },
    [isRequests, removeInterview, tab, upsertInterview]
  );

  const handleRescheduled = useCallback(
    (interview: Interview) => {
      if (isRequests) {
        // Approve / propose new time clears the open request
        removeInterview(interview.id);
        return;
      }
      if (interview.status === tab) {
        upsertInterview(interview);
      } else {
        removeInterview(interview.id);
      }
    },
    [isRequests, removeInterview, tab, upsertInterview]
  );

  const handleCompleted = useCallback(
    (interview: Interview) => {
      if (isRequests || interview.status !== tab) {
        removeInterview(interview.id);
        return;
      }
      upsertInterview(interview);
    },
    [isRequests, removeInterview, tab, upsertInterview]
  );

  const handleRescheduleDenied = useCallback(
    (interviewId: string) => {
      removeInterview(interviewId);
    },
    [removeInterview]
  );

  const emptyLabel =
    tab === "requests"
      ? "No reschedule requests."
      : `No ${formatInterviewStatusLabel(tab).toLowerCase()} invitations.`;

  return (
    <main className={cn("flex h-full min-h-0 w-full flex-col", className)}>
      <ScrollArea className="h-full w-full">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Invitations
          </h1>

          <div className="mt-6">
            <PillTabs tabs={STATUS_TABS} activeTab={tab} onTabChange={setTab} />
          </div>

          <section className="mt-6">
            {isLoading ? (
              <InterviewListingCardSkeleton />
            ) : error && interviews.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <p className="text-center text-sm text-destructive">{error}</p>
                <Button type="button" variant="outline" onClick={refetch}>
                  Try again
                </Button>
              </div>
            ) : interviews.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12">
                <HugeiconsIcon
                  icon={UserStar01Icon}
                  strokeWidth={2}
                  className="size-14 text-primary"
                />
                <p className="text-center text-base font-medium text-muted-foreground">
                  {emptyLabel}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {interviews.map((interview) => (
                  <InterviewListingCard
                    key={interview.id}
                    interview={interview}
                    viewerRole={role}
                    variant={isRequests ? "requests" : "default"}
                    onCancelled={handleCancelled}
                    onRescheduled={handleRescheduled}
                    onCompleted={handleCompleted}
                    onRescheduleDenied={handleRescheduleDenied}
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
        </div>
      </ScrollArea>
    </main>
  );
}
