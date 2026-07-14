/** What a swipe/like targets */
export type MatchTargetType = "locum" | "permanent" | "candidate";

/** Swipe decision on PUT `/matches` */
export type MatchDecision = "like" | "pass";

/** Mutual match lifecycle status */
export type MatchStatus = "matched" | (string & {});

/** Persisted like/pass row from like and likes-list responses */
export type LikeRecord = {
  id: string;
  actorUserId: string;
  targetType: MatchTargetType;
  targetId: string;
  decision: MatchDecision;
  createdAt: string;
  updatedAt: string;
};

/** Mutual match row (without nested relations) */
export type MatchRecord = {
  id: string;
  candidateUserId: string;
  practiceUserId: string;
  targetType: MatchTargetType;
  targetId: string;
  score: number;
  status: MatchStatus;
  createdAt: string;
  updatedAt: string;
};

/** Display preview of the swipe target returned with like/pass */
export type MatchTargetPreview = {
  name: string;
  avatar: string | null;
};

/** Candidate sender on a received like */
export type LikeSenderCandidate = {
  id: string;
  userId: string;
  role: "candidate";
  fullName: string;
  jobTitle: string;
  avatar: string | null;
};

/** Practice sender on a received like */
export type LikeSenderPractice = {
  userId: string;
  role: "practice";
  name: string;
  avatar: string | null;
};

/** Sender attached to received likes only (omitted on sent likes) */
export type LikeSender = LikeSenderCandidate | LikeSenderPractice;

/** Like row from GET `/matches/likes` */
export type LikeListItem = LikeRecord & {
  sender?: LikeSender;
};

/**
 * Nested job/target on GET `/matches`.
 * Locum and permanent payloads share common fields; type-specific fields are optional.
 */
export type MatchListTarget = {
  id: string;
  userId: string;
  role: string;
  /** Display location label (city/address string from the API) */
  location?: string | null;
  status: string;
  skills?: string[] | null;
  software?: string[] | null;
  specialisms?: string[] | null;
  complianceDocuments?: string[] | null;
  createdAt?: string;
  updatedAt?: string;

  // Locum fields
  date?: string | null;
  time?: string | null;
  timeStart?: string | null;
  timeEnd?: string | null;
  breakDurationMins?: number | null;
  /** Decimal string amount (e.g. `"15.00"`) */
  rate?: string | null;
  rateInterval?: string | null;
  isOvertimePaid?: boolean | null;
  paymentTerms?: string | null;
  ppeProvided?: boolean | null;
  mandatoryDocsForBooking?: boolean | null;

  // Permanent fields
  startDate?: string | null;
  jobTitle?: string | null;
  jobDescription?: string | null;
  contractType?: string | null;
  jobType?: string | null;
  salaryRange?: string | null;
  workingHours?: string | null;
  isWorkingHoursFlexible?: boolean | null;
  workingHoursStart?: string | null;
  workingHoursEnd?: string | null;
  interviewType?: string | null;
  benefits?: string[] | null;
  experienceLevels?: string[] | null;
};

/** Nested candidate profile on a mutual match */
export type MatchListCandidate = {
  id: string;
  userId: string;
  fullName: string;
  jobTitle: string;
  isVerified: boolean;
  avatar: string | null;
  gender?: string | null;
  aboutMe?: string | null;
  currentStatus?: string | null;
};

/** Nested practice profile on a mutual match */
export type MatchListPractice = {
  id: string;
  userId: string;
  clinicType: string;
  isVerified: boolean;
  avatar: string | null;
  name: string;
  about?: string | null;
  website?: string | null;
};

/** Match row from GET `/matches` with nested relations */
export type MatchListItem = MatchRecord & {
  target: MatchListTarget;
  candidate: MatchListCandidate;
  practice: MatchListPractice;
};

/**
 * Pagination metadata for matches/likes lists.
 * Note: `total` lives on the response envelope, not here.
 */
export type MatchesPagination = {
  page: number;
  limit: number;
  totalPages: number;
};

/** Query params for GET `/matches` and GET `/matches/likes` */
export type ListMatchesParams = {
  /** Page number (default 1) */
  page?: number;
  /** Page size (default 10; likes max 20) */
  limit?: number;
};
