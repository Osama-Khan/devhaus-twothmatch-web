import type { JobStatus, JobType } from "@/features/jobs/types/job";

/** Rate interval for locum pay (e.g. config `rate_types`) */
export type JobRateInterval = "hour" | "day" | (string & {});

/**
 * Writable locum fields for create/update.
 * All optional — the API picks only defined keys (PATCH); create sends the full set.
 */
export type LocumJobFields = {
  roleId?: string;
  locationId?: string;
  date?: string;
  timeStart?: string;
  timeEnd?: string;
  breakDurationMins?: number;
  rate?: number;
  rateInterval?: JobRateInterval;
  isOvertimePaid?: boolean;
  paymentTermsId?: string;
  cancellationPolicyId?: string;
  isParkingAvailable?: boolean;
  isPublicTransportAvailable?: boolean;
  complianceDocuments?: string[];
  skills?: string[];
  software?: string[];
  specialisms?: string[];
  ppeProvided?: boolean;
  status?: JobStatus;
};

/**
 * Writable permanent fields for create/update.
 * All optional — the API picks only defined keys (PATCH); create sends the full set.
 */
export type PermanentJobFields = {
  roleId?: string;
  locationId?: string;
  contractTypeId?: string;
  jobTypeId?: string;
  interviewTypeId?: string;
  startDate?: string;
  jobTitle?: string;
  jobDescription?: string;
  workingHoursStart?: string;
  workingHoursEnd?: string;
  isWorkingHoursFlexible?: boolean;
  skills?: string[];
  software?: string[];
  experienceLevels?: string[];
  specialisms?: string[];
  salaryRange?: string;
  benefits?: string[];
  screeningQuestions?: string[];
  autoRejectIfQuestionsNotAnswered?: boolean;
  complianceDocuments?: string[];
  boostListing?: boolean;
  status?: JobStatus;
};

/** Body for POST `/jobs` with `type: "locum"` */
export type CreateLocumJobRequest = LocumJobFields & {
  type: "locum";
};

/** Body for POST `/jobs` with `type: "permanent"` */
export type CreatePermanentJobRequest = PermanentJobFields & {
  type: "permanent";
};

/** Discriminated create body for POST `/jobs` (`type` required) */
export type CreateJobRequest =
  | CreateLocumJobRequest
  | CreatePermanentJobRequest;

/**
 * Partial update body for PATCH `/jobs`.
 * `id` is required. Optional `type` disambiguates locum vs permanent;
 * otherwise the API checks both tables. Updatable fields match create for that type.
 */
export type UpdateJobRequest = {
  id: string;
  type?: JobType;
} & LocumJobFields &
  PermanentJobFields;

/**
 * Body for DELETE `/jobs`.
 * `id` is required. Optional `type` disambiguates locum vs permanent.
 */
export type DeleteJobRequest = {
  id: string;
  type?: JobType;
};
