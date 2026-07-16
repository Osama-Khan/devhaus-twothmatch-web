"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/features/candidates/utils/format-candidate-display";
import { InterviewCancelDialog } from "@/features/interviews/components/interview-cancel-dialog";
import { InterviewRescheduleDialog } from "@/features/interviews/components/interview-reschedule-dialog";
import { interviewsService } from "@/features/interviews/services/interviews-service";
import type {
  Interview,
  InterviewViewerRole,
} from "@/features/interviews/types";
import {
  formatInterviewDate,
  getInterviewCardDisplay,
} from "@/features/interviews/utils/format-interview-display";
import { isInterviewDateTimeInFuture } from "@/features/interviews/form/interview-schemas";
import { isSuccessResponse } from "@/lib/types/response";
import { cn } from "@/lib/utils";

type InterviewListingCardProps = {
  interview: Interview;
  viewerRole: InterviewViewerRole | null;
  /**
   * `requests` shows approve/deny for practice on open reschedule requests.
   * Default shows complete / reschedule / cancel actions.
   */
  variant?: "default" | "requests";
  /** Called after cancel/decline — interview moves to cancelled */
  onCancelled: (interview: Interview) => void;
  /** Called after reschedule / reschedule request / approve */
  onRescheduled: (interview: Interview) => void;
  /** Called after marking complete — interview moves to completed */
  onCompleted: (interview: Interview) => void;
  /** Called after denying a reschedule request (practice) */
  onRescheduleDenied?: (interviewId: string) => void;
  className?: string;
};

/**
 * Interview list card — counterparty, schedule, meeting details, and actions.
 */
export function InterviewListingCard({
  interview,
  viewerRole,
  variant = "default",
  onCancelled,
  onRescheduled,
  onCompleted,
  onRescheduleDenied,
  className,
}: InterviewListingCardProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDenying, setIsDenying] = useState(false);

  const display = getInterviewCardDisplay(interview, viewerRole);
  const isRequests = variant === "requests";
  const isBusy = isCompleting || isApproving || isDenying;

  const isActionable =
    interview.status === "pending" || interview.status === "confirmed";
  /** Candidates may only decline pending interviews per API */
  const canCancel =
    !isRequests &&
    isActionable &&
    (viewerRole === "practice" ||
      (viewerRole === "candidate" && interview.status === "pending"));
  const canReschedule = !isRequests && isActionable && viewerRole != null;
  const canComplete =
    !isRequests && interview.status === "confirmed" && viewerRole != null;
  const canReviewRequest =
    isRequests &&
    viewerRole === "practice" &&
    interview.rescheduleRequested;

  async function handleComplete() {
    setIsCompleting(true);
    const response = await interviewsService.completeInterview(interview.id);
    setIsCompleting(false);

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data.message);
    onCompleted(response.data.interview);
  }

  async function handleApproveRequest() {
    if (
      interview.rescheduleRequestedDate &&
      interview.rescheduleRequestedTime &&
      !isInterviewDateTimeInFuture(
        interview.rescheduleRequestedDate,
        interview.rescheduleRequestedTime
      )
    ) {
      toast.error(
        "The requested date and time are in the past. Choose a new slot."
      );
      setRescheduleOpen(true);
      return;
    }

    setIsApproving(true);
    const response = await interviewsService.rescheduleInterview(interview.id);
    setIsApproving(false);

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data.message);
    onRescheduled(response.data.interview);
  }

  async function handleDenyRequest() {
    setIsDenying(true);
    const response = await interviewsService.declineReschedule(interview.id);
    setIsDenying(false);

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data.message);
    onRescheduleDenied?.(interview.id);
  }

  return (
    <>
      <article
        className={cn(
          "overflow-hidden rounded-3xl bg-card shadow-sm",
          className
        )}
      >
        <div className="p-5">
          <div className="flex items-start gap-3">
            <Avatar className="size-12">
              {display.avatar ? (
                <AvatarImage src={display.avatar} alt={display.name} />
              ) : null}
              <AvatarFallback>{getInitials(display.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-foreground">
                    {display.name}
                  </h3>
                  {display.subtitle ? (
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {display.subtitle}
                    </p>
                  ) : null}
                </div>

                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    strokeWidth={2}
                    className="size-3.5 shrink-0"
                  />
                  {display.dateLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <HugeiconsIcon
                icon={Clock01Icon}
                strokeWidth={2}
                className="size-3.5 shrink-0"
              />
              {display.timeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <HugeiconsIcon
                icon={Video01Icon}
                strokeWidth={2}
                className="size-3.5 shrink-0"
              />
              {display.meetingTypeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <HugeiconsIcon
                icon={Location01Icon}
                strokeWidth={2}
                className="size-3.5 shrink-0"
              />
              {display.locationLabel}
            </span>
          </div>

          {display.notes ? (
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
              {display.notes}
            </p>
          ) : null}

          {display.rescheduleRequested ? (
            <div className="mt-3 rounded-2xl bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
              {isRequests ? "Requested" : "Reschedule requested"}
              {display.rescheduleRequestLabel
                ? `: ${display.rescheduleRequestLabel}`
                : ""}
              {interview.rescheduleRequestReason ? (
                <p className="mt-1 font-normal text-primary/80">
                  {interview.rescheduleRequestReason}
                </p>
              ) : null}
              {isRequests &&
              interview.rescheduleRequestedDate &&
              interview.rescheduleRequestedTime ? (
                <p className="mt-1 font-normal text-primary/80">
                  Current slot: {formatInterviewDate(interview.date)} at{" "}
                  {interview.time}
                </p>
              ) : null}
            </div>
          ) : null}

          {display.declined && display.declineReason ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Declined: {display.declineReason}
            </p>
          ) : null}

          {canReviewRequest ? (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                className="flex-1"
                disabled={isBusy}
                onClick={() => void handleApproveRequest()}
              >
                {isApproving ? "Approving…" : "Approve"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                disabled={isBusy}
                onClick={() => setRescheduleOpen(true)}
              >
                Propose new time
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                disabled={isBusy}
                onClick={() => void handleDenyRequest()}
              >
                {isDenying ? "Denying…" : "Deny"}
              </Button>
            </div>
          ) : null}

          {isRequests && viewerRole === "candidate" ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Waiting for the practice to respond to your reschedule request.
            </p>
          ) : null}

          {!isRequests && (canComplete || canReschedule || canCancel) ? (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {canComplete ? (
                <Button
                  type="button"
                  className="flex-1"
                  disabled={isBusy}
                  onClick={() => void handleComplete()}
                >
                  {isCompleting ? "Completing…" : "Complete"}
                </Button>
              ) : null}
              {canReschedule ? (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={isBusy}
                  onClick={() => setRescheduleOpen(true)}
                >
                  Reschedule
                </Button>
              ) : null}
              {canCancel ? (
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  disabled={isBusy}
                  onClick={() => setCancelOpen(true)}
                >
                  {viewerRole === "candidate" ? "Decline" : "Cancel"}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </article>

      <InterviewCancelDialog
        interview={interview}
        viewerRole={viewerRole}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onSuccess={onCancelled}
      />
      <InterviewRescheduleDialog
        interview={interview}
        viewerRole={viewerRole}
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        onSuccess={onRescheduled}
      />
    </>
  );
}
