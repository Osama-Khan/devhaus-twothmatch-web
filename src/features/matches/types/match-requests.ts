import type { MatchDecision, MatchTargetType } from "@/features/matches/types/match";

/** Body for PUT `/matches` (like or pass a target) */
export type LikeTargetRequest = {
  targetType: MatchTargetType;
  targetId: string;
  decision: MatchDecision;
};
