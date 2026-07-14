import type {
  LikeListItem,
  LikeRecord,
  MatchListItem,
  MatchRecord,
  MatchTargetPreview,
  MatchesPagination,
} from "@/features/matches/types/match";

/** Response from PUT `/matches` (201) */
export type LikeTargetResponse = {
  like: LikeRecord;
  /** Present when the like completes a mutual match; always null for passes */
  match: MatchRecord | null;
  target: MatchTargetPreview;
};

/** Response from GET `/matches/likes` */
export type ListLikesResponse = {
  total: number;
  likes: LikeListItem[];
  pagination: MatchesPagination;
};

/** Response from GET `/matches` */
export type ListMatchesResponse = {
  total: number;
  matches: MatchListItem[];
  pagination: MatchesPagination;
};
