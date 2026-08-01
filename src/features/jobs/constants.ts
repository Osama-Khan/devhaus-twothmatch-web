/** Total steps in the locum create-job wizard */
export const CREATE_LOCUM_JOB_TOTAL_STEPS = 6;

/** Total steps in the permanent create-job wizard */
export const CREATE_PERMANENT_JOB_TOTAL_STEPS = 6;

/** @deprecated Prefer CREATE_LOCUM_JOB_TOTAL_STEPS / CREATE_PERMANENT_JOB_TOTAL_STEPS */
export const CREATE_JOB_TOTAL_STEPS = CREATE_LOCUM_JOB_TOTAL_STEPS;

/** Inclusive character range required by POST `/ai/jobs/refine-jd` */
export const REFINE_JD_MIN_CHARS = 100;
export const REFINE_JD_MAX_CHARS = 1000;

/** Valid job create route types */
export const CREATE_JOB_TYPES = ["locum", "permanent"] as const;

export type CreateJobRouteType = (typeof CREATE_JOB_TYPES)[number];

/** Type guard for `/my-jobs/create/[type]` params */
export function isCreateJobRouteType(
  value: string
): value is CreateJobRouteType {
  return (CREATE_JOB_TYPES as readonly string[]).includes(value);
}
