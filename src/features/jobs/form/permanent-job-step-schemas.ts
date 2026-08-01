import { z } from "zod";
import type { PermanentJobFormData } from "@/features/jobs/types/permanent-job-form";
import { isFutureDateInputValue } from "@/features/jobs/utils/future-date";
import { hasMinimumShiftGap } from "@/features/jobs/utils/locum-shift-duration";

/** Step 1 — job basics */
export const permanentStep1Schema = z.object({
  roleId: z.string().trim().min(1, "Role is required"),
  locationId: z.string().trim().min(1, "Location is required"),
  contractTypeId: z.string().trim().min(1, "Contract type is required"),
  jobTypeId: z.string().trim().min(1, "Job type is required"),
  startDate: z
    .string()
    .trim()
    .min(1, "Start date is required")
    .refine(isFutureDateInputValue, "Start date must be in the future"),
});

/** Step 2 — job details */
export const permanentStep2Schema = z
  .object({
    jobTitle: z.string().trim().min(1, "Job title is required"),
    jobDescription: z.string(),
    useAiJd: z.boolean(),
    skills: z.array(z.string()).min(1, "Select at least one skill"),
    software: z.array(z.string()).min(1, "Select at least one software"),
    experienceLevels: z
      .array(z.string())
      .min(1, "Select at least one experience level"),
    specialisms: z.array(z.string()).min(1, "Select at least one specialism"),
  })
  .superRefine((value, ctx) => {
    if (!value.useAiJd && value.jobDescription.trim().length < 1) {
      ctx.addIssue({
        code: "custom",
        message: "Job description is required",
        path: ["jobDescription"],
      });
    }
  });

/** Step 3 — salary & benefits */
export const permanentStep3Schema = z
  .object({
    salaryRange: z
      .string()
      .trim()
      .min(1, "Annual salary is required")
      .refine((value) => {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) && parsed > 1000;
      }, "Salary must be greater than 1000"),
    benefits: z.array(z.string()).min(1, "Select at least one benefit"),
    workingHoursStart: z.string().trim().min(1, "Start time is required"),
    workingHoursEnd: z.string().trim().min(1, "End time is required"),
    isWorkingHoursFlexible: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (
      !hasMinimumShiftGap(value.workingHoursStart, value.workingHoursEnd, 30)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "End time must be at least 30 minutes after start",
        path: ["workingHoursEnd"],
      });
    }
  });

/** Step 4 — compliance */
export const permanentStep4Schema = z.object({
  complianceDocuments: z
    .array(z.string())
    .min(1, "Select at least one mandatory document"),
  autoFilterValidDocs: z.boolean(),
});

/** Step 5 — interview settings */
export const permanentStep5Schema = z.object({
  interviewTypeId: z.string().trim().min(1, "Interview type is required"),
});

function firstFieldError(
  issues: { path: PropertyKey[]; message: string }[],
  field: string
): string | null {
  const issue = issues.find((item) => item.path[0] === field);
  return issue?.message ?? null;
}

/** Field error helper for step 1 */
export function getPermanentStep1FieldError(
  data: PermanentJobFormData,
  field: keyof PermanentJobFormData
): string | null {
  const result = permanentStep1Schema.safeParse({
    roleId: data.roleId,
    locationId: data.locationId,
    contractTypeId: data.contractTypeId,
    jobTypeId: data.jobTypeId,
    startDate: data.startDate,
  });
  if (result.success) return null;
  return firstFieldError(result.error.issues, field);
}

/** Field error helper for step 2 */
export function getPermanentStep2FieldError(
  data: PermanentJobFormData,
  field: keyof PermanentJobFormData
): string | null {
  const result = permanentStep2Schema.safeParse({
    jobTitle: data.jobTitle,
    jobDescription: data.jobDescription,
    useAiJd: data.useAiJd,
    skills: data.skills,
    software: data.software,
    experienceLevels: data.experienceLevels,
    specialisms: data.specialisms,
  });
  if (result.success) return null;
  return firstFieldError(result.error.issues, field);
}

/** Field error helper for step 3 */
export function getPermanentStep3FieldError(
  data: PermanentJobFormData,
  field: keyof PermanentJobFormData
): string | null {
  const result = permanentStep3Schema.safeParse({
    salaryRange: data.salaryRange,
    benefits: data.benefits,
    workingHoursStart: data.workingHoursStart,
    workingHoursEnd: data.workingHoursEnd,
    isWorkingHoursFlexible: data.isWorkingHoursFlexible,
  });
  if (result.success) return null;
  return firstFieldError(result.error.issues, field);
}

/** Field error helper for step 4 */
export function getPermanentStep4FieldError(
  data: PermanentJobFormData,
  field: keyof PermanentJobFormData
): string | null {
  const result = permanentStep4Schema.safeParse({
    complianceDocuments: data.complianceDocuments,
    autoFilterValidDocs: data.autoFilterValidDocs,
  });
  if (result.success) return null;
  return firstFieldError(result.error.issues, field);
}

/** Field error helper for step 5 */
export function getPermanentStep5FieldError(
  data: PermanentJobFormData,
  field: keyof PermanentJobFormData
): string | null {
  const result = permanentStep5Schema.safeParse({
    interviewTypeId: data.interviewTypeId,
  });
  if (result.success) return null;
  return firstFieldError(result.error.issues, field);
}
