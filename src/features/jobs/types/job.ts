/** Practice-owned job listing kind */
export type JobType = "locum" | "permanent";

/**
 * Job listing status.
 * Create defaults to `active`; locum may also use `urgent`.
 * Pause/activate toggles use `paused` / `active`.
 */
export type JobStatus = "active" | "paused" | "urgent" | (string & {});

/** Rate payload on locum list items */
export type LocumJobRate = {
  hourlyRate: string;
  dayRate: string;
};

/** Rate payload on permanent list items */
export type PermanentJobRate = {
  salaryRange: string;
};

/** Locum job row from GET `/jobs` */
export type LocumJobListItem = {
  id: string;
  type: "locum";
  title: string;
  rate: LocumJobRate;
  status: JobStatus;
  createdAt: string;
};

/** Permanent job row from GET `/jobs` */
export type PermanentJobListItem = {
  id: string;
  type: "permanent";
  title: string;
  rate: PermanentJobRate;
  status: JobStatus;
  createdAt: string;
};

/** Combined list item from GET `/jobs` */
export type JobListItem = LocumJobListItem | PermanentJobListItem;

/**
 * Locum shift entity returned by create/update.
 * Field set matches `LOCUM_FIELDS` plus server-owned keys.
 */
export type LocumJob = {
  id: string;
  userId: string;
  practiceLocationId: string | null;
  role: string | null;
  location: string | null;
  date: string | null;
  time: string | null;
  breakLunchDuration: string | null;
  dayRate: number | null;
  hourlyRate: number | null;
  overtimeRules: string | null;
  paymentTerms: string | null;
  cancellationPolicy: string | null;
  complianceDocuments: string[] | null;
  skills: string[] | null;
  software: string[] | null;
  specialisms: string[] | null;
  parking: string | null;
  publicTransport: string | null;
  ppeProvided: boolean | null;
  autoblockUnverified: boolean | null;
  mandatoryDocsForBooking: string[] | null;
  complianceText: string | null;
  preapprovedCandidates: string[] | null;
  candidateExpressesInterest: boolean | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
};

/**
 * Permanent job entity returned by create/update.
 * Field set matches `PERMANENT_FIELDS` plus server-owned keys.
 */
export type PermanentJob = {
  id: string;
  userId: string;
  practiceLocationId: string | null;
  role: string | null;
  location: string | null;
  contractType: string | null;
  jobType: string | null;
  startDate: string | null;
  jobTitle: string | null;
  jobDescription: string | null;
  skills: string[] | null;
  software: string[] | null;
  experienceLevels: string[] | null;
  specialisms: string[] | null;
  salaryRange: string | null;
  benefits: string[] | null;
  workingHours: string | null;
  flexibleWorkingOption: boolean | null;
  interviewType: string | null;
  screeningQuestions: string[] | null;
  autoRejectIfQuestionsNotAnswered: boolean | null;
  complianceDocuments: string[] | null;
  boostListing: boolean | null;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
};

/** Pagination metadata returned with job lists */
export type JobsPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/** Query params for GET `/jobs` */
export type ListJobsParams = {
  /** Page number (default 1) */
  page?: number;
  /** Page size (default 10, max 100) */
  limit?: number;
  /** Optional status filter (e.g. `active`) */
  status?: JobStatus;
  /** Optional type filter: `locum` | `permanent` */
  type?: JobType;
};
