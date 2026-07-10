import type { JobStatus, JobType } from "@/features/jobs/types/job";

/**
 * Writable locum fields (`LOCUM_FIELDS` from createJob controller).
 * All optional — the API picks only defined keys.
 */
export type LocumJobFields = {
  role?: string;
  location?: string;
  date?: string;
  time?: string;
  breakLunchDuration?: string;
  dayRate?: number;
  hourlyRate?: number;
  overtimeRules?: string;
  paymentTerms?: string;
  cancellationPolicy?: string;
  complianceDocuments?: string[];
  skills?: string[];
  software?: string[];
  specialisms?: string[];
  parking?: string;
  publicTransport?: string;
  ppeProvided?: boolean;
  autoblockUnverified?: boolean;
  mandatoryDocsForBooking?: string[];
  complianceText?: string;
  preapprovedCandidates?: string[];
  candidateExpressesInterest?: boolean;
  status?: JobStatus;
  practiceLocationId?: string | null;
};

/**
 * Writable permanent fields (`PERMANENT_FIELDS` from createJob controller).
 * All optional — the API picks only defined keys.
 */
export type PermanentJobFields = {
  role?: string;
  location?: string;
  contractType?: string;
  jobType?: string;
  startDate?: string;
  jobTitle?: string;
  jobDescription?: string;
  skills?: string[];
  software?: string[];
  experienceLevels?: string[];
  specialisms?: string[];
  salaryRange?: string;
  benefits?: string[];
  workingHours?: string;
  flexibleWorkingOption?: boolean;
  interviewType?: string;
  screeningQuestions?: string[];
  autoRejectIfQuestionsNotAnswered?: boolean;
  complianceDocuments?: string[];
  boostListing?: boolean;
  status?: JobStatus;
  practiceLocationId?: string | null;
};

/** Body for POST `/jobs` with `type: "locum"` */
export type CreateLocumJobRequest = LocumJobFields & {
  type: "locum";
  /**
   * When true (or `status` is `urgent`), triggers an urgent-shift notification.
   * Not persisted via `LOCUM_FIELDS`.
   */
  urgent?: boolean;
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
  urgent?: boolean;
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
