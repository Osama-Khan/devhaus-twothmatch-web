"use client";

import { useState, type ComponentProps } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarAdd01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScheduleInterviewForm } from "@/features/interviews/components/schedule-interview-form";
import type { Interview } from "@/features/interviews/types";
import { cn } from "@/lib/utils";

type ScheduleInterviewButtonProps = {
  /** Candidate user id for POST `/interviews` */
  candidateUserId: string;
  /** Shown in the modal helper copy */
  candidateName?: string;
  onScheduled?: (interview: Interview) => void;
  className?: string;
  /** Forwarded to the trigger button */
  variant?: ComponentProps<typeof Button>["variant"];
};

/**
 * Schedule interview trigger with an owned modal and form.
 * Click opens the dialog; success closes it and notifies the parent.
 */
export function ScheduleInterviewButton({
  candidateUserId,
  candidateName,
  onScheduled,
  className,
  variant = "secondary",
}: ScheduleInterviewButtonProps) {
  const [open, setOpen] = useState(false);

  function handleSuccess(interview: Interview) {
    setOpen(false);
    onScheduled?.(interview);
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        className={cn("w-full sm:w-auto", className)}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        <HugeiconsIcon icon={CalendarAdd01Icon} strokeWidth={2} />
        Schedule interview
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Schedule interview</DialogTitle>
            <DialogDescription>
              Choose a meeting type, location, and a future date and time.
            </DialogDescription>
          </DialogHeader>

          <ScheduleInterviewForm
            candidateUserId={candidateUserId}
            candidateName={candidateName}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
