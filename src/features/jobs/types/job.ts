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
  createdAt: string;
  date: string;
  role: JobNamedRef;
  location: JobListLocation;
  timeStart: string;
  timeEnd: string;
  breakDurationMins: number;
  rate: LocumJobRate;
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
  rate: PermanentJobRate;
};

/** Combined list item from GET `/jobs` */
export type JobListItem = LocumJobListItem | PermanentJobListItem;

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
