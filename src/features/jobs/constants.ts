/** Placeholder step count until create-job forms are defined */
export const CREATE_JOB_TOTAL_STEPS = 3;

/** Valid job create route types */
export const CREATE_JOB_TYPES = ["locum", "permanent"] as const;

export type CreateJobRouteType = (typeof CREATE_JOB_TYPES)[number];

/** Type guard for `/my-jobs/create/[type]` params */
export function isCreateJobRouteType(
  value: string
): value is CreateJobRouteType {
  return (CREATE_JOB_TYPES as readonly string[]).includes(value);
}
