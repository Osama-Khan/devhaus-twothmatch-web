/** Shared location payload on candidate browse cards */
export type FeedCandidateLocation = {
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
export type FeedCandidateBase = {
  id: string;
  userId: string;
  fullName: string;
  avatar: string;
  jobTitle: string;
  workingPattern: string;
  distanceMiles: number;
  location: FeedCandidateLocation;
};

/** Locum (part-time) candidate card from browse API */
export type LocumCandidate = FeedCandidateBase & {
  rate: LocumCandidateRate;
  availability: LocumAvailabilitySlot[];
};

/** Permanent (full-time) candidate card from browse API */
export type PermanentCandidate = FeedCandidateBase & {
  rate: PermanentCandidateRate;
  postcode: string;
};

export type FeedCandidatesPagination = {
  page: number;
  limit: number;
  totalPages: number;
};

export type BrowseLocumCandidatesResponse = {
  totalCandidates: number;
  candidates: LocumCandidate[];
  pagination: FeedCandidatesPagination;
};

export type BrowsePermanentCandidatesResponse = {
  totalCandidates: number;
  candidates: PermanentCandidate[];
  pagination: FeedCandidatesPagination;
};

/** Query params for candidate browse endpoints */
export type BrowseFeedCandidatesParams = {
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

/** Candidate feed tab options on the home page */
export type CandidateFeedTab = "locum" | "permanent";

/** Applied candidate feed filters emitted by the filters popover */
export type CandidateFeedFilters = {
  workingPattern?: string;
  payRangeMin?: number;
  payRangeMax?: number;
  searchRadius?: number;
  latitude?: number;
  longitude?: number;
};

/** Metadata row item on a feed listing card */
export type CandidateMetaItem = {
  label: string;
  value: string;
};

/** Candidate listing card in the center feed */
export type CandidateListing = {
  id: string;
  posterUserId: string;
  isNew: boolean;
  posterName: string;
  avatar: string;
  title: string;
  rate: string;
  matchPercent?: number;
  requirements?: string[];
  meta: CandidateMetaItem[];
};
