/** Shared location payload on candidate browse cards */
export type JobCandidateLocation = {
  address: string;
  latitude: string;
  longitude: string;
};

/** Locum availability slot */
export type LocumAvailabilitySlot = {
  id: string;
  dateTime: string;
};

/** Locum candidate rate */
export type LocumCandidateRate = {
  hourlyRate: string;
};

/** Permanent candidate rate */
export type PermanentCandidateRate = {
  payMin: number;
  payMax: number;
  salaryPreference: string;
};

/** Base fields shared by locum and permanent candidate cards */
export type JobCandidateBase = {
  id: string;
  userId: string;
  fullName: string;
  avatar: string;
  jobTitle: string;
  workingPattern: string;
  distanceMiles: number;
  location: JobCandidateLocation;
};

/** Locum (part-time) candidate card from browse API */
export type LocumCandidate = JobCandidateBase & {
  rate: LocumCandidateRate;
  availability: LocumAvailabilitySlot[];
};

/** Permanent (full-time) candidate card from browse API */
export type PermanentCandidate = JobCandidateBase & {
  rate: PermanentCandidateRate;
  postcode: string;
};

export type JobCandidatesPagination = {
  page: number;
  limit: number;
  totalPages: number;
};

export type BrowseLocumCandidatesResponse = {
  totalCandidates: number;
  candidates: LocumCandidate[];
  pagination: JobCandidatesPagination;
};

export type BrowsePermanentCandidatesResponse = {
  totalCandidates: number;
  candidates: PermanentCandidate[];
  pagination: JobCandidatesPagination;
};

/** Query params for candidate browse endpoints */
export type BrowseJobCandidatesParams = {
  page?: number;
  limit?: number;
  workingPattern?: string;
  payRangeMin?: number;
  payRangeMax?: number;
  salaryPreferenceMin?: number;
  salaryPreferenceMax?: number;
  searchRadius?: number;
  latitude?: number;
  longitude?: number;
};
