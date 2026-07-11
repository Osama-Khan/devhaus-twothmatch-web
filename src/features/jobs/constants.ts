/** Total steps in the locum create-job wizard */
export const CREATE_LOCUM_JOB_TOTAL_STEPS = 6;

/** Placeholder step count for permanent create until forms are defined */
export const CREATE_PERMANENT_JOB_TOTAL_STEPS = 3;

/** @deprecated Prefer CREATE_LOCUM_JOB_TOTAL_STEPS / CREATE_PERMANENT_JOB_TOTAL_STEPS */
export const CREATE_JOB_TOTAL_STEPS = CREATE_LOCUM_JOB_TOTAL_STEPS;

/** Valid job create route types */
export const CREATE_JOB_TYPES = ["locum", "permanent"] as const;

export type CreateJobRouteType = (typeof CREATE_JOB_TYPES)[number];

/** Type guard for `/my-jobs/create/[type]` params */
export function isCreateJobRouteType(
  value: string
): value is CreateJobRouteType {
  return (CREATE_JOB_TYPES as readonly string[]).includes(value);
}
