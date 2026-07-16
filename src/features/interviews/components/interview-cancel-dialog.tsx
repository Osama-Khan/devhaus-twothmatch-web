"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  declineInterviewSchema,
  type DeclineInterviewFormData,
} from "@/features/interviews/form/interview-schemas";
import { interviewsService } from "@/features/interviews/services/interviews-service";
import type {
  Interview,
  InterviewViewerRole,
} from "@/features/interviews/types";
import { isSuccessResponse } from "@/lib/types/response";

type InterviewCancelDialogProps = {
  interview: Interview | null;
  viewerRole: InterviewViewerRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful cancel/decline with the updated interview */
  onSuccess: (interview: Interview) => void;
};

/**
 * Cancel (practice) or decline (candidate) dialog for pending/confirmed interviews.
 * Candidate decline requires a reason and is only valid for pending rows.
 */
export function InterviewCancelDialog({
  interview,
  viewerRole,
  open,
  onOpenChange,
  onSuccess,
}: InterviewCancelDialogProps) {
  const isCandidate = viewerRole === "candidate";
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeclineInterviewFormData>({
    resolver: zodResolver(declineInterviewSchema),
    defaultValues: { reason: "" },
  });

  useEffect(() => {
    if (open) {
      reset({ reason: "" });
      setIsCancelling(false);
    }
  }, [open, reset]);

  async function handlePracticeCancel() {
    if (!interview) {
      return;
    }

    setIsCancelling(true);
    const response = await interviewsService.cancelInterview(interview.id);
    setIsCancelling(false);

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data.message);
    onOpenChange(false);
    onSuccess(response.data.interview);
  }

  const busy = isSubmitting || isCancelling;

  async function handleCandidateDecline(data: DeclineInterviewFormData) {
    if (!interview) {
      return;
    }

    const response = await interviewsService.declineInterview(interview.id, {
      reason: data.reason,
    });

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data.message);
    onOpenChange(false);
    onSuccess(response.data.interview);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCandidate ? "Decline invitation" : "Cancel interview"}
          </DialogTitle>
          <DialogDescription>
            {isCandidate
              ? "Let the practice know why you cannot attend. This cannot be undone."
              : "This will cancel the interview for both parties. This cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        {isCandidate ? (
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(handleCandidateDecline)}
          >
            <Field data-invalid={Boolean(errors.reason)}>
              <FieldLabel htmlFor="decline-reason">Reason</FieldLabel>
              <Textarea
                id="decline-reason"
                placeholder="e.g. Schedule conflict"
                rows={3}
                {...register("reason")}
              />
              <FieldError errors={[errors.reason]} />
            </Field>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => onOpenChange(false)}
              >
                Keep invitation
              </Button>
              <Button type="submit" variant="destructive" disabled={busy}>
                {isSubmitting ? "Declining…" : "Decline"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => onOpenChange(false)}
            >
              Keep interview
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={busy}
              onClick={() => void handlePracticeCancel()}
            >
              {isCancelling ? "Cancelling…" : "Cancel interview"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
