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

/** Nested job/target summary on a mutual match */
export type MatchListTarget = {
  id: string;
  userId: string;
  role: string;
  date?: string;
  status: string;
};

/** Nested candidate profile on a mutual match */
export type MatchListCandidate = {
  id: string;
  userId: string;
  fullName: string;
  jobTitle: string;
  isVerified: boolean;
  avatar: string | null;
};

/** Nested practice profile on a mutual match */
export type MatchListPractice = {
  id: string;
  userId: string;
  clinicType: string;
  isVerified: boolean;
  avatar: string | null;
  name: string;
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
