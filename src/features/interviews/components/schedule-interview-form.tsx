"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  scheduleInterviewFormSchema,
  type ScheduleInterviewFormFields,
} from "@/features/interviews/form/interview-schemas";
import { interviewsService } from "@/features/interviews/services/interviews-service";
import type { Interview } from "@/features/interviews/types";
import { isSuccessResponse } from "@/lib/types/response";
import { cn } from "@/lib/utils";

const MEETING_TYPES = ["Video", "In Person", "Call"] as const;
const LOCATIONS = ["Online", "Office"] as const;

const selectClassName = cn(
  "h-11 w-full min-w-0 appearance-none rounded-4xl border border-input bg-card px-3 py-1 pr-10 text-base transition-colors outline-none",
  "focus-visible:border-ring focus-visible:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
  "text-foreground md:text-sm"
);

/** Today's local date as `YYYY-MM-DD` for `<input type="date" min>` */
function todayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

type ScheduleInterviewFormProps = {
  /** Candidate user id sent as `candidateUserId` on schedule */
  candidateUserId: string;
  /** Optional name shown in helper copy */
  candidateName?: string;
  onSuccess?: (interview: Interview) => void;
  onCancel?: () => void;
  className?: string;
};

/**
 * Schedule interview form — POST `/interviews` (practice).
 * Candidate is fixed via `candidateUserId`; other fields are editable.
 */
export function ScheduleInterviewForm({
  candidateUserId,
  candidateName,
  onSuccess,
  onCancel,
  className,
}: ScheduleInterviewFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleInterviewFormFields>({
    resolver: zodResolver(scheduleInterviewFormSchema),
    defaultValues: {
      meetingType: "Video",
      location: "Online",
      date: "",
      time: "",
      notes: "",
    },
  });

  useEffect(() => {
    reset({
      meetingType: "Video",
      location: "Online",
      date: "",
      time: "",
      notes: "",
    });
  }, [candidateUserId, reset]);

  async function onSubmit(data: ScheduleInterviewFormFields) {
    const response = await interviewsService.scheduleInterview({
      candidateUserId,
      meetingType: data.meetingType,
      location: data.location,
      date: data.date,
      time: data.time,
      notes: data.notes?.trim() ? data.notes.trim() : undefined,
    });

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data.message);
    onSuccess?.(response.data.interview);
  }

  const minDate = todayDateInputValue();

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      {candidateName ? (
        <p className="text-sm text-muted-foreground">
          Scheduling with{" "}
          <span className="font-medium text-foreground">{candidateName}</span>
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field data-invalid={Boolean(errors.meetingType)}>
          <FieldLabel htmlFor="schedule-meeting-type">Meeting type</FieldLabel>
          <div className="relative">
            <select
              id="schedule-meeting-type"
              className={selectClassName}
              aria-invalid={Boolean(errors.meetingType)}
              {...register("meetingType")}
            >
              {MEETING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          <FieldError errors={[errors.meetingType]} />
        </Field>

        <Field data-invalid={Boolean(errors.location)}>
          <FieldLabel htmlFor="schedule-location">Location</FieldLabel>
          <div className="relative">
            <select
              id="schedule-location"
              className={selectClassName}
              aria-invalid={Boolean(errors.location)}
              {...register("location")}
            >
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          <FieldError errors={[errors.location]} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field data-invalid={Boolean(errors.date)}>
          <FieldLabel htmlFor="schedule-date">Date</FieldLabel>
          <Input
            id="schedule-date"
            type="date"
            min={minDate}
            aria-invalid={Boolean(errors.date)}
            {...register("date")}
          />
          <FieldError errors={[errors.date]} />
        </Field>
        <Field data-invalid={Boolean(errors.time)}>
          <FieldLabel htmlFor="schedule-time">Time</FieldLabel>
          <Input
            id="schedule-time"
            type="time"
            aria-invalid={Boolean(errors.time)}
            {...register("time")}
          />
          <FieldError errors={[errors.time]} />
        </Field>
      </div>

      <Field data-invalid={Boolean(errors.notes)}>
        <FieldLabel htmlFor="schedule-notes">Notes (optional)</FieldLabel>
        <Textarea
          id="schedule-notes"
          rows={3}
          placeholder="e.g. Initial screening call"
          aria-invalid={Boolean(errors.notes)}
          {...register("notes")}
        />
        <FieldError errors={[errors.notes]} />
      </Field>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Scheduling…" : "Schedule interview"}
        </Button>
      </div>
    </form>
  );
}
