"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getInitials } from "@/features/candidates/utils/format-candidate-display";
import { jobsService } from "@/features/jobs/services/jobs-service";
import type { JobListItem, JobStatus } from "@/features/jobs/types";
import {
  formatJobListRate,
  formatJobPostedDate,
} from "@/features/jobs/utils/format-job-display";
import { appRoutes } from "@/lib/routes";
import { createRoute } from "@/lib/utils/route";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isDraft = job.isDraft === true;
  const isActive = status === "active";
  const isBusy = pendingAction != null;
  const isDeleting = pendingAction === "delete";

  const continueEditingHref = `${
    createRoute(appRoutes.nav.myJobs.create.byType._self, {
      type: job.type,
    }).path
  }?draftId=${encodeURIComponent(job.id)}`;

  async function updateStatus(nextStatus: "active" | "paused") {
    if (pendingAction != null || status === nextStatus || isDraft) {
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
      setIsDeleteDialogOpen(false);
      setIsDeleted(true);
      return;
    }

    toast.error("Failed to delete job");
    setPendingAction(null);
  }

  if (isDeleted) {
    return null;
  }

  return (
    <>
      <article className={cn("rounded-3xl bg-card p-5 shadow-sm", className)}>
        <div className="flex flex-row items-center justify-between gap-2">
          <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
          <div className="flex shrink-0 flex-row items-center gap-2">
            {isDraft ? <Badge variant="outline">Draft</Badge> : null}
            <Badge variant="soft">
              {job.type === "locum" ? "Locum" : "Permanent"}
            </Badge>
          </div>
        </div>

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
          {isDraft ? "Draft saved" : `Posted on: ${formatJobPostedDate(job.createdAt)}`}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
            disabled={isBusy}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
          {isDraft ? (
            <Button type="button" variant="default" asChild disabled={isBusy}>
              <Link href={continueEditingHref}>Continue editing</Link>
            </Button>
          ) : isActive ? (
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => void updateStatus("paused")}
            >
              {pendingAction === "paused" ? "Pausing…" : "Pause"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              disabled={isBusy}
              onClick={() => void updateStatus("active")}
            >
              {pendingAction === "active" ? "Activating…" : "Activate"}
            </Button>
          )}
        </div>
      </article>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (isDeleting) {
            return;
          }
          setIsDeleteDialogOpen(open);
        }}
      >
        <DialogContent showCloseButton={!isDeleting}>
          <DialogHeader>
            <DialogTitle>Delete {isDraft ? "draft" : "job"}?</DialogTitle>
            <DialogDescription>
              This will permanently delete &ldquo;{job.title}&rdquo;
              {isDraft ? "" : " and its related matches"}. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void deleteJob()}
            >
              {isDeleting
                ? "Deleting…"
                : isDraft
                  ? "Delete draft"
                  : "Delete job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
