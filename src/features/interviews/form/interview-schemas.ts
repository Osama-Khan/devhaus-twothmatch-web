import { z } from "zod";

/** ISO calendar date `YYYY-MM-DD` */
const interviewDateSchema = z
  .string()
  .min(1, "Date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date (YYYY-MM-DD)");

/** 24-hour clock `HH:MM` (optional trailing seconds from time inputs) */
const interviewTimeSchema = z
  .string()
  .min(1, "Time is required")
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    "Enter a valid time (HH:MM)"
  );

/**
 * Parse `YYYY-MM-DD` + `HH:MM`/`HH:MM:SS` into a local `Date`, or `null` if invalid.
 */
function parseInterviewDateTime(date: string, time: string): Date | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(
    time.trim()
  );

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const seconds = timeMatch[3] != null ? Number(timeMatch[3]) : 0;

  const slot = new Date(year, month - 1, day, hours, minutes, seconds);
  return Number.isNaN(slot.getTime()) ? null : slot;
}

/**
 * True when `date` (`YYYY-MM-DD`) + `time` (`HH:MM` or `HH:MM:SS`) is after now
 * in the local timezone.
 */
export function isInterviewDateTimeInFuture(
  date: string,
  time: string
): boolean {
  const slot = parseInterviewDateTime(date, time);
  return slot != null && slot.getTime() > Date.now();
}

/**
 * True when the calendar date is strictly before today (local).
 */
function isInterviewDateBeforeToday(date: string): boolean {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!dateMatch) {
    return false;
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const selected = new Date(year, month - 1, day);
  if (Number.isNaN(selected.getTime())) {
    return false;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return selected.getTime() < today.getTime();
}

/**
 * Attach a future-slot error to the date field when the day is past,
 * otherwise to the time field (e.g. today with a past clock time).
 */
function addFutureDateTimeIssue(
  ctx: z.RefinementCtx,
  date: string,
  time: string,
  datePath: (string | number)[],
  timePath: (string | number)[]
) {
  if (isInterviewDateTimeInFuture(date, time)) {
    return;
  }

  if (isInterviewDateBeforeToday(date)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Choose a date in the future",
      path: datePath,
    });
    return;
  }

  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: "Choose a time in the future",
    path: timePath,
  });
}

export const interviewMeetingTypeSchema = z.enum([
  "Video",
  "In Person",
  "Call",
]);

export const interviewLocationSchema = z.enum(["Online", "Office"]);

/** Schedule form — maps to POST `/interviews` (practice) */
export const scheduleInterviewSchema = z.object({
  candidateUserId: z.string().trim().min(1, "Select a candidate"),
  meetingType: interviewMeetingTypeSchema,
  location: interviewLocationSchema,
  date: interviewDateSchema,
  time: interviewTimeSchema,
  notes: z.string().optional(),
});

/** Decline form — maps to DELETE `/interviews/:id` (candidate) */
export const declineInterviewSchema = z.object({
  reason: z.string().trim().min(1, "Reason is required"),
});

/** Candidate reschedule request — maps to POST `/interviews/:id/reschedule` */
export const requestRescheduleSchema = z
  .object({
    requestedDate: interviewDateSchema,
    requestedTime: interviewTimeSchema,
    reason: z.string().trim().min(1, "Reason is required"),
  })
  .superRefine((data, ctx) => {
    addFutureDateTimeIssue(
      ctx,
      data.requestedDate,
      data.requestedTime,
      ["requestedDate"],
      ["requestedTime"]
    );
  });

/**
 * Practice reschedule / approve — maps to POST `/interviews/:id/reschedule`.
 * Both fields optional so a pending candidate request can be approved as-is.
 * When either is set, both are required and must be valid.
 */
export const rescheduleInterviewSchema = z
  .object({
    date: z.string().optional(),
    time: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const date = data.date?.trim() ?? "";
    const time = data.time?.trim() ?? "";

    if (!date && !time) {
      return;
    }

    if (!date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date is required when setting a new time",
        path: ["date"],
      });
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid date (YYYY-MM-DD)",
        path: ["date"],
      });
    }

    if (!time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Time is required when setting a new date",
        path: ["time"],
      });
    } else if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(time)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid time (HH:MM)",
        path: ["time"],
      });
    }

    if (
      date &&
      time &&
      /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(time)
    ) {
      addFutureDateTimeIssue(ctx, date, time, ["date"], ["time"]);
    }
  });

/**
 * Practice reschedule form — requires an explicit new date and time.
 * Prefer this in the UI; use empty body via the service to approve a request as-is.
 */
export const practiceRescheduleFormSchema = z
  .object({
    date: interviewDateSchema,
    time: interviewTimeSchema,
  })
  .superRefine((data, ctx) => {
    addFutureDateTimeIssue(ctx, data.date, data.time, ["date"], ["time"]);
  });

export type ScheduleInterviewFormData = z.infer<typeof scheduleInterviewSchema>;
export type DeclineInterviewFormData = z.infer<typeof declineInterviewSchema>;
export type RequestRescheduleFormData = z.infer<typeof requestRescheduleSchema>;
export type RescheduleInterviewFormData = z.infer<
  typeof rescheduleInterviewSchema
>;
export type PracticeRescheduleFormData = z.infer<
  typeof practiceRescheduleFormSchema
>;
