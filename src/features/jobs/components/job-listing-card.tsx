"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/features/candidates/utils/format-candidate-display";
import { jobsService } from "@/features/jobs/services/jobs-service";
import type { JobListItem, JobStatus } from "@/features/jobs/types";
import {
  formatJobListRate,
  formatJobPostedDate,
} from "@/features/jobs/utils/format-job-display";
import { isSuccessResponse } from "@/lib/types/response";
import { cn } from "@/lib/utils";

type PracticeSummary = {
  name: string;
  avatarUrl?: string | null;
};

type JobListingCardProps = {
  job: JobListItem;
  practice: PracticeSummary;
  className?: string;
};

type CardAction = "active" | "paused" | "delete";

/** Practice-owned job card for the My Jobs list */
export function JobListingCard({
  job,
  practice,
  className,
}: JobListingCardProps) {
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [isDeleted, setIsDeleted] = useState(false);
  const [pendingAction, setPendingAction] = useState<CardAction | null>(null);

  const isActive = status === "active";
  const isBusy = pendingAction != null;

  async function updateStatus(nextStatus: "active" | "paused") {
    if (pendingAction != null || status === nextStatus) {
      return;
    }

    setPendingAction(nextStatus);

    const response = await jobsService.updateJob({
      id: job.id,
      type: job.type,
      status: nextStatus,
    });

    if (isSuccessResponse(response)) {
      setStatus(nextStatus);
    } else {
      toast.error(
        nextStatus === "active"
          ? "Failed to activate job"
          : "Failed to pause job"
      );
    }

    setPendingAction(null);
  }

  async function deleteJob() {
    if (pendingAction != null) {
      return;
    }

    setPendingAction("delete");

    const response = await jobsService.deleteJob({
      id: job.id,
      type: job.type,
    });

    if (isSuccessResponse(response)) {
      setIsDeleted(true);
    } else {
      toast.error("Failed to delete job");
      setPendingAction(null);
    }
  }

  if (isDeleted) {
    return null;
  }

  return (
    <article
      className={cn(
        "rounded-3xl border border-primary/40 bg-card p-5 shadow-sm",
        className
      )}
    >
      <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>

      <div className="mt-3 flex items-center gap-2.5">
        <Avatar>
          {practice.avatarUrl ? (
            <AvatarImage src={practice.avatarUrl} alt={practice.name} />
          ) : null}
          <AvatarFallback>{getInitials(practice.name)}</AvatarFallback>
        </Avatar>
        <p className="min-w-0 truncate text-sm text-muted-foreground">
          {practice.name}
        </p>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <p className="text-2xl font-semibold text-primary">
          {formatJobListRate(job)}
        </p>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        Posted on: {formatJobPostedDate(job.createdAt)}
      </p>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={isBusy}
          onClick={() => void deleteJob()}
        >
          {pendingAction === "delete" ? "Deleting…" : "Delete"}
        </Button>
        <Button
          type="button"
          variant={!isActive ? "default" : "outline"}
          disabled={isBusy || !isActive}
          className={cn(isActive && "text-primary")}
          onClick={() => void updateStatus("paused")}
        >
          {pendingAction === "paused" ? "Pausing…" : "Pause"}
        </Button>
        <Button
          type="button"
          variant={isActive ? "default" : "outline"}
          disabled={isBusy || isActive}
          className={cn(!isActive && "text-primary")}
          onClick={() => void updateStatus("active")}
        >
          {pendingAction === "active" ? "Activating…" : "Active"}
        </Button>
      </div>
    </article>
  );
}
