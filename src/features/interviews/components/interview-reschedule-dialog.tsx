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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  isInterviewDateTimeInFuture,
  practiceRescheduleFormSchema,
  requestRescheduleSchema,
  type PracticeRescheduleFormData,
  type RequestRescheduleFormData,
} from "@/features/interviews/form/interview-schemas";
import { interviewsService } from "@/features/interviews/services/interviews-service";
import type {
  Interview,
  InterviewViewerRole,
} from "@/features/interviews/types";
import { formatInterviewDate } from "@/features/interviews/utils/format-interview-display";
import { isSuccessResponse } from "@/lib/types/response";

type InterviewRescheduleDialogProps = {
  interview: Interview | null;
  viewerRole: InterviewViewerRole | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (interview: Interview) => void;
};

/** Today's local date as `YYYY-MM-DD` for `<input type="date" min>` */
function todayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultPracticeValues(interview: Interview | null) {
  if (!interview) {
    return { date: "", time: "" };
  }

  if (
    interview.rescheduleRequested &&
    interview.rescheduleRequestedDate &&
    interview.rescheduleRequestedTime
  ) {
    return {
      date: interview.rescheduleRequestedDate,
      time: interview.rescheduleRequestedTime,
    };
  }

  return { date: interview.date, time: interview.time };
}

/**
 * Reschedule dialog — practice sets a new slot; candidate requests one with a reason.
 */
export function InterviewRescheduleDialog({
  interview,
  viewerRole,
  open,
  onOpenChange,
  onSuccess,
}: InterviewRescheduleDialogProps) {
  const isCandidate = viewerRole === "candidate";
  const [isApproving, setIsApproving] = useState(false);
  const hasPendingRequest = Boolean(interview?.rescheduleRequested);

  const practiceForm = useForm<PracticeRescheduleFormData>({
    resolver: zodResolver(practiceRescheduleFormSchema),
    defaultValues: defaultPracticeValues(interview),
  });

  const candidateForm = useForm<RequestRescheduleFormData>({
    resolver: zodResolver(requestRescheduleSchema),
    defaultValues: {
      requestedDate: interview?.date ?? "",
      requestedTime: interview?.time ?? "",
      reason: "",
    },
  });

  useEffect(() => {
    if (!open || !interview) {
      return;
    }

    practiceForm.reset(defaultPracticeValues(interview));
    candidateForm.reset({
      requestedDate: interview.date,
      requestedTime: interview.time,
      reason: "",
    });
    setIsApproving(false);
  }, [open, interview, practiceForm, candidateForm]);

  async function handlePracticeSubmit(data: PracticeRescheduleFormData) {
    if (!interview) {
      return;
    }

    const response = await interviewsService.rescheduleInterview(interview.id, {
      date: data.date,
      time: data.time,
    });

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data.message);
    onOpenChange(false);
    onSuccess(response.data.interview);
  }

  async function handleApproveRequest() {
    if (!interview) {
      return;
    }

    if (
      interview.rescheduleRequestedDate &&
      interview.rescheduleRequestedTime &&
      !isInterviewDateTimeInFuture(
        interview.rescheduleRequestedDate,
        interview.rescheduleRequestedTime
      )
    ) {
      toast.error("The requested date and time are in the past. Choose a new slot.");
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
    onOpenChange(false);
    onSuccess(response.data.interview);
  }

  async function handleCandidateSubmit(data: RequestRescheduleFormData) {
    if (!interview) {
      return;
    }

    const response = await interviewsService.requestReschedule(interview.id, {
      requestedDate: data.requestedDate,
      requestedTime: data.requestedTime,
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

  const isSubmitting =
    practiceForm.formState.isSubmitting ||
    candidateForm.formState.isSubmitting ||
    isApproving;
  const minDate = todayDateInputValue();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule interview</DialogTitle>
          <DialogDescription>
            {isCandidate
              ? "Propose a new date and time in the future. The practice will need to confirm."
              : hasPendingRequest
                ? "Approve the candidate's request or set a different future date and time."
                : "Choose a new date and time in the future for this interview."}
          </DialogDescription>
        </DialogHeader>

        {!isCandidate &&
        hasPendingRequest &&
        interview?.rescheduleRequestedDate &&
        interview.rescheduleRequestedTime ? (
          <div className="rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
            Requested:{" "}
            <span className="font-medium text-foreground">
              {formatInterviewDate(interview.rescheduleRequestedDate)} at{" "}
              {interview.rescheduleRequestedTime}
            </span>
            {interview.rescheduleRequestReason ? (
              <p className="mt-1 text-xs">
                Reason: {interview.rescheduleRequestReason}
              </p>
            ) : null}
          </div>
        ) : null}

        {isCandidate ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={candidateForm.handleSubmit(handleCandidateSubmit)}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field
                data-invalid={Boolean(
                  candidateForm.formState.errors.requestedDate
                )}
              >
                <FieldLabel htmlFor="reschedule-requested-date">Date</FieldLabel>
                <Input
                  id="reschedule-requested-date"
                  type="date"
                  min={minDate}
                  {...candidateForm.register("requestedDate")}
                />
                <FieldError
                  errors={[candidateForm.formState.errors.requestedDate]}
                />
              </Field>
              <Field
                data-invalid={Boolean(
                  candidateForm.formState.errors.requestedTime
                )}
              >
                <FieldLabel htmlFor="reschedule-requested-time">Time</FieldLabel>
                <Input
                  id="reschedule-requested-time"
                  type="time"
                  {...candidateForm.register("requestedTime")}
                />
                <FieldError
                  errors={[candidateForm.formState.errors.requestedTime]}
                />
              </Field>
            </div>

            <Field
              data-invalid={Boolean(candidateForm.formState.errors.reason)}
            >
              <FieldLabel htmlFor="reschedule-reason">Reason</FieldLabel>
              <Textarea
                id="reschedule-reason"
                placeholder="Why do you need a new time?"
                rows={3}
                {...candidateForm.register("reason")}
              />
              <FieldError errors={[candidateForm.formState.errors.reason]} />
            </Field>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {candidateForm.formState.isSubmitting
                  ? "Submitting…"
                  : "Request reschedule"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={practiceForm.handleSubmit(handlePracticeSubmit)}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field
                data-invalid={Boolean(practiceForm.formState.errors.date)}
              >
                <FieldLabel htmlFor="reschedule-date">Date</FieldLabel>
                <Input
                  id="reschedule-date"
                  type="date"
                  min={minDate}
                  {...practiceForm.register("date")}
                />
                <FieldError errors={[practiceForm.formState.errors.date]} />
              </Field>
              <Field
                data-invalid={Boolean(practiceForm.formState.errors.time)}
              >
                <FieldLabel htmlFor="reschedule-time">Time</FieldLabel>
                <Input
                  id="reschedule-time"
                  type="time"
                  {...practiceForm.register("time")}
                />
                <FieldError errors={[practiceForm.formState.errors.time]} />
              </Field>
            </div>

            <DialogFooter className="sm:flex-wrap">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {hasPendingRequest ? (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  onClick={() => void handleApproveRequest()}
                >
                  {isApproving ? "Approving…" : "Approve request"}
                </Button>
              ) : null}
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {practiceForm.formState.isSubmitting
                  ? "Saving…"
                  : "Reschedule"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
