/** Practice-owned job listing kind */
export type JobType = "locum" | "permanent";

/**
 * Job listing status.
 * Create defaults to `active`; locum may also use `urgent`.
 * Pause/activate toggles use `paused` / `active`.
 */
export type JobStatus = "active" | "paused" | "urgent" | (string & {});

/** Named config/ref object on job list items (role, terms, policy, etc.) */
export type JobNamedRef = {
  id: string;
  name: string;
};

/** Practice location embedded on job list items */
export type JobListLocation = {
  id: string;
  address: string;
  postcode: string;
  latitude: number;
  longitude: number;
};

/** Rate payload on locum list items */
export type LocumJobRate = {
  amount: string;
  interval: string;
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
  status: JobStatus;
  /** True when the job is a draft (not yet published) */
  isDraft?: boolean;
  createdAt: string;
  date: string;
  role: JobNamedRef;
  location: JobListLocation;
  timeStart: string;
  timeEnd: string;
  breakDurationMins: number;
  /** May be incomplete on drafts */
  rate?: LocumJobRate | null;
  isOvertimePaid: boolean;
  paymentTerms: JobNamedRef;
  cancellationPolicy: JobNamedRef;
  isParkingAvailable: boolean;
  isPublicTransportAvailable: boolean;
};

/** Permanent job row from GET `/jobs` */
export type PermanentJobListItem = {
  id: string;
  type: "permanent";
  title: string;
  status: JobStatus;
  /** True when the job is a draft (not yet published) */
  isDraft?: boolean;
  createdAt: string;
  jobTitle: string;
  startDate: string;
  role: JobNamedRef;
  location: JobListLocation;
  contractType: JobNamedRef;
  jobType: JobNamedRef;
  interviewType: JobNamedRef;
  workingHoursStart: string;
  workingHoursEnd: string;
  isWorkingHoursFlexible: boolean;
  /** May be incomplete on drafts */
  rate?: PermanentJobRate | null;
};

/** Combined list item from GET `/jobs` */
export type JobListItem = LocumJobListItem | PermanentJobListItem;

/**
 * Label or id string arrays on shaped job detail (GET `/jobs/:id`).
 * Prefer `JobNamedRef` when the API returns `{ id, name }`.
 */
export type JobDetailTag = string | JobNamedRef;

/** Locum detail from GET `/jobs/:id` — list card fields plus compliance/skills/etc. */
export type LocumJobDetail = LocumJobListItem & {
  skills?: JobDetailTag[];
  software?: JobDetailTag[];
  specialisms?: JobDetailTag[];
  ppeProvided?: boolean;
  autoblockUnverified?: boolean;
  mandatoryDocsForBooking?: boolean;
  complianceText?: string | null;
  complianceDocuments?: JobDetailTag[];
  preapprovedCandidates?: boolean;
  candidateExpressesInterest?: boolean;
  instantBook?: boolean;
  approvalRequired?: boolean;
};

/** Permanent detail from GET `/jobs/:id` */
export type PermanentJobDetail = PermanentJobListItem & {
  jobDescription?: string | null;
  skills?: JobDetailTag[];
  software?: JobDetailTag[];
  experienceLevels?: JobDetailTag[];
  specialisms?: JobDetailTag[];
  benefits?: JobDetailTag[];
  screeningQuestions?: string[];
  autoRejectIfQuestionsNotAnswered?: boolean;
  complianceDocuments?: JobDetailTag[];
  autoFilterValidDocs?: boolean;
  boostListing?: boolean;
};

/** Discriminated job detail from GET `/jobs/:id` */
export type JobDetail = LocumJobDetail | PermanentJobDetail;

/**
 * Locum shift entity returned by create/update.
 * Field set matches writable locum fields plus server-owned keys.
 */
export type LocumJob = {
  id: string;
  userId: string;
  roleId: string | null;
  locationId: string | null;
  date: string | null;
  timeStart: string | null;
  timeEnd: string | null;
  breakDurationMins: number | null;
  rate: number | null;
  rateInterval: string | null;
  isOvertimePaid: boolean | null;
  paymentTermsId: string | null;
  cancellationPolicyId: string | null;
  isParkingAvailable: boolean | null;
  isPublicTransportAvailable: boolean | null;
  complianceDocuments: string[] | null;
  skills: string[] | null;
  software: string[] | null;
  specialisms: string[] | null;
  ppeProvided: boolean | null;
  status: JobStatus;
  /** True when the job is a draft (not yet published) */
  isDraft?: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * Permanent job entity returned by create/update.
 * Field set matches writable permanent fields plus server-owned keys.
 */
export type PermanentJob = {
  id: string;
  userId: string;
  roleId: string | null;
  locationId: string | null;
  contractTypeId: string | null;
  jobTypeId: string | null;
  interviewTypeId: string | null;
  startDate: string | null;
  jobTitle: string | null;
  jobDescription: string | null;
  workingHoursStart: string | null;
  workingHoursEnd: string | null;
  isWorkingHoursFlexible: boolean | null;
  skills: string[] | null;
  software: string[] | null;
  experienceLevels: string[] | null;
  specialisms: string[] | null;
  salaryRange: string | null;
  benefits: string[] | null;
  screeningQuestions: string[] | null;
  autoRejectIfQuestionsNotAnswered: boolean | null;
  complianceDocuments: string[] | null;
  boostListing: boolean | null;
  status: JobStatus;
  /** True when the job is a draft (not yet published) */
  isDraft?: boolean;
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
  /** Optional draft filter: `true` = drafts only, `false` = published only */
  isDraft?: boolean;
};
