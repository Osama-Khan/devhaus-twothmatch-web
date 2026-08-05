export type {
  JobDetail,
  JobDetailTag,
  JobListItem,
  JobListLocation,
  JobNamedRef,
  JobStatus,
  JobType,
  JobsPagination,
  ListJobsParams,
  LocumJob,
  LocumJobDetail,
  LocumJobListItem,
  LocumJobRate,
  PermanentJob,
  PermanentJobDetail,
  PermanentJobListItem,
  PermanentJobRate,
} from "@/features/jobs/types/job";

export type {
  CreateJobRequest,
  CreateLocumJobRequest,
  CreatePermanentJobRequest,
  DeleteJobRequest,
  JobRateInterval,
  LocumJobFields,
  PermanentJobFields,
  UpdateJobRequest,
} from "@/features/jobs/types/job-requests";

export type {
  CreateJobResponse,
  CreateLocumJobResponse,
  CreatePermanentJobResponse,
  DeleteJobResponse,
  GetJobResponse,
  ListJobsResponse,
  UpdateJobResponse,
} from "@/features/jobs/types/job-responses";
