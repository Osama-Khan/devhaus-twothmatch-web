import type {
  JobDetail,
  JobListItem,
  JobsPagination,
  LocumJob,
  LocumJobDetail,
  PermanentJob,
  PermanentJobDetail,
} from "@/features/jobs/types/job";

/** Response from GET `/jobs` */
export type ListJobsResponse = {
  jobs: JobListItem[];
  pagination: JobsPagination;
};

/** Response from GET `/jobs/:id` */
export type GetJobResponse =
  | { job: LocumJobDetail; type: "locum" }
  | { job: PermanentJobDetail; type: "permanent" };

/** Response from POST `/jobs` when creating a locum shift (201) */
export type CreateLocumJobResponse = {
  job: LocumJob;
  type: "locum";
};

/** Response from POST `/jobs` when creating a permanent job (201) */
export type CreatePermanentJobResponse = {
  job: PermanentJob;
  type: "permanent";
};

/** Discriminated response from POST `/jobs` */
export type CreateJobResponse =
  | CreateLocumJobResponse
  | CreatePermanentJobResponse;

/**
 * Response from PATCH `/jobs`.
 */
export type UpdateJobResponse = CreateJobResponse;

/** Response from DELETE `/jobs` (200) */
export type DeleteJobResponse = {
  message: string;
  id: string;
  type: "locum" | "permanent";
};

export type { JobDetail };
