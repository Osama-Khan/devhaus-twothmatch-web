import { z } from "zod";
import type { LocumJobFormData } from "@/features/jobs/types/locum-job-form";
import { isFutureDateInputValue } from "@/features/jobs/utils/future-date";
import {
  getMaxBreakDurationMins,
  hasMinimumShiftGap,
} from "@/features/jobs/utils/locum-shift-duration";

/** Step 1 — shift basics */
export const locumStep1Schema = z
  .object({
    roleId: z.string().trim().min(1, "Role is required"),
    locationId: z.string().trim().min(1, "Location is required"),
    date: z
      .string()
      .trim()
      .min(1, "Date is required")
      .refine(isFutureDateInputValue, "Date must be in the future"),
    timeStart: z.string().trim().min(1, "Start time is required"),
    timeEnd: z.string().trim().min(1, "End time is required"),
    breakDurationMins: z.number().int().min(0),
  })
  .superRefine((value, ctx) => {
    if (!hasMinimumShiftGap(value.timeStart, value.timeEnd, 30)) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be at least 30 minutes after start",
        path: ["timeEnd"],
      });
    }

    const maxBreak = getMaxBreakDurationMins(value.timeStart, value.timeEnd);
    if (
      maxBreak != null &&
      value.breakDurationMins > maxBreak
    ) {
      ctx.addIssue({
        code: "custom",
        message: `Break cannot exceed ${maxBreak} minutes`,
        path: ["breakDurationMins"],
      });
    }
  });

/** Step 2 — rate & payment */
export const locumStep2Schema = z.object({
  rateInterval: z.enum(["day", "hour"], {
    error: "Select daily or hourly",
  }),
  rate: z
    .string()
    .trim()
    .min(1, "Rate is required")
    .refine((value) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) && parsed > 0;
    }, "Enter a valid rate"),
  isOvertimePaid: z.boolean(),
  paymentTermsId: z.string().trim().min(1, "Payment terms are required"),
  cancellationPolicyId: z
    .string()
    .trim()
    .min(1, "Cancellation policy is required"),
});

/** Step 3 — role requirements */
export const locumStep3Schema = z.object({
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  software: z.array(z.string()).min(1, "Select at least one software"),
  specialisms: z.array(z.string()).min(1, "Select at least one specialism"),
  ppeProvided: z.boolean(),
  isParkingAvailable: z.boolean(),
  isPublicTransportAvailable: z.boolean(),
});

/** Step 5 — booking mode (exactly one path) */
export const locumStep5Schema = z
  .object({
    instantBook: z.boolean(),
    approvalRequired: z.boolean(),
  })
  .refine((value) => value.instantBook !== value.approvalRequired, {
    message: "Choose Instant Book or Approval Required",
    path: ["instantBook"],
  });

/** Field error helper for step 1 */
export function getLocumStep1FieldError(
  data: LocumJobFormData,
  field: keyof LocumJobFormData
): string | null {
  const result = locumStep1Schema.safeParse({
    roleId: data.roleId,
    locationId: data.locationId,
    date: data.date,
    timeStart: data.timeStart,
    timeEnd: data.timeEnd,
    breakDurationMins: data.breakDurationMins,
  });

  if (result.success) {
    return null;
  }

  const issue = result.error.issues.find((item) => item.path[0] === field);
  return issue?.message ?? null;
}

/** Field error helper for step 2 */
export function getLocumStep2FieldError(
  data: LocumJobFormData,
  field: keyof LocumJobFormData
): string | null {
  const result = locumStep2Schema.safeParse({
    rateInterval: data.rateInterval || undefined,
    rate: data.rate,
    isOvertimePaid: data.isOvertimePaid,
    paymentTermsId: data.paymentTermsId,
    cancellationPolicyId: data.cancellationPolicyId,
  });

  if (result.success) {
    return null;
  }

  const issue = result.error.issues.find((item) => item.path[0] === field);
  return issue?.message ?? null;
}
