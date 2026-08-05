import type { JobStatus, JobType } from "@/features/jobs/types/job";

/** Rate interval for locum pay (`day` | `hour`) */
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
  /** Minutes; `null` or omit when no break (UI uses `0` for none) */
  breakDurationMins?: number | null;
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
  autoblockUnverified?: boolean;
  mandatoryDocsForBooking?: boolean;
  instantBook?: boolean;
  approvalRequired?: boolean;
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
  /** When true, only candidates with the required docs can apply */
  autoFilterValidDocs?: boolean;
  boostListing?: boolean;
  status?: JobStatus;
};

/** Body for POST `/jobs` with `type: "locum"` */
export type CreateLocumJobRequest = LocumJobFields & {
  type: "locum";
  /**
   * Draft latch: `true` creates a free draft; omit/`false` publishes (uses POSTS quota).
   * Prefer explicit `true`/`false` in the client.
   */
  isDraft?: boolean;
};

/** Body for POST `/jobs` with `type: "permanent"` */
export type CreatePermanentJobRequest = PermanentJobFields & {
  type: "permanent";
  /**
   * Draft latch: `true` creates a free draft; omit/`false` publishes (uses POSTS quota).
   * Prefer explicit `true`/`false` in the client.
   */
  isDraft?: boolean;
};

/** Discriminated create body for POST `/jobs` (`type` required) */
export type CreateJobRequest =
  | CreateLocumJobRequest
  | CreatePermanentJobRequest;

/**
 * Partial update body for PATCH `/jobs`.
 * `id` is required. Optional `type` disambiguates locum vs permanent;
 * otherwise the API checks both tables. Updatable fields match create for that type.
 * Send `isDraft: false` to publish a draft; cannot revert to draft.
 */
export type UpdateJobRequest = {
  id: string;
  type?: JobType;
  /** One-way latch: `false` publishes a draft. Never send `true` on a live job. */
  isDraft?: boolean;
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
