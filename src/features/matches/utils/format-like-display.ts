import type {
  LikeActor,
  LikeListItem,
  LikeTargetJobPreview,
  LikeTargetPreview,
  MatchTargetType,
} from "@/features/matches/types";
import {
  formatMatchDate,
  formatMatchTargetTypeLabel,
} from "@/features/matches/utils/format-match-display";

/** Display fields derived from a like for the listing card */
export type LikeCardDisplay = {
  name: string;
  avatar: string | null;
  subtitle: string | null;
  targetType: MatchTargetType;
  /** Green badge copy describing who liked whom */
  badgeText: string;
  likedAtLabel: string;
};

function nonEmpty(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** True when a sent-like target is a job listing (has `jobId` + `jobTitle`). */
export function isLikeTargetJob(
  target: LikeTargetPreview
): target is LikeTargetJobPreview {
  return "jobId" in target && typeof target.jobId === "string";
}

/** Display name for a like actor (candidate `fullName` or practice `name`). */
export function getLikeActorName(actor: LikeActor): string {
  if (actor.role === "candidate") {
    return nonEmpty(actor.fullName) ?? "Someone";
  }
  return nonEmpty(actor.name) ?? "Someone";
}

/** Format a display name as a possessive (e.g. `Alex's`, `James'`). */
export function formatPossessiveName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Someone's";
  }
  return /s$/i.test(trimmed) ? `${trimmed}'` : `${trimmed}'s`;
}

/**
 * Build the green badge sentence for a like row.
 *
 * - Sent candidate: `You liked Name's profile`
 * - Sent job: `You liked Role Job posted by Clinic`
 * - Received candidate: `Name liked your profile`
 * - Received job: `Name liked Role Job posted by you`
 */
export function formatLikeBadgeText(like: LikeListItem): string {
  if (like.actor) {
    const name = getLikeActorName(like.actor);
    if (like.targetType === "candidate") {
      return `${name} liked your profile`;
    }

    const role =
      like.actor.role === "candidate"
        ? nonEmpty(like.actor.jobTitle)
        : null;

    return `${name} liked ${role ?? formatMatchTargetTypeLabel(like.targetType)} Job posted by you`;
  }

  if (like.target) {
    const name = nonEmpty(like.target.name) ?? "Someone";
    if (isLikeTargetJob(like.target)) {
      const role = nonEmpty(like.target.jobTitle) ?? "Job";
      return `You liked ${role} Job posted by ${name}`;
    }

    return `You liked ${formatPossessiveName(name)} profile`;
  }

  // Sent like whose target snapshot failed to resolve (`target: null`).
  if (like.targetType === "candidate") {
    return "You liked a profile";
  }

  return `You liked a ${formatMatchTargetTypeLabel(like.targetType)} Job`;
}

/**
 * Map a like list row to card display fields.
 * `actor` = received like; `target` = sent like.
 */
export function getLikeCardDisplay(like: LikeListItem): LikeCardDisplay {
  if (like.actor) {
    if (like.actor.role === "candidate") {
      return {
        name: getLikeActorName(like.actor),
        avatar: like.actor.avatar,
        subtitle: nonEmpty(like.actor.jobTitle),
        targetType: like.targetType,
        badgeText: formatLikeBadgeText(like),
        likedAtLabel: formatMatchDate(like.createdAt),
      };
    }

    return {
      name: getLikeActorName(like.actor),
      avatar: like.actor.avatar,
      subtitle: null,
      targetType: like.targetType,
      badgeText: formatLikeBadgeText(like),
      likedAtLabel: formatMatchDate(like.createdAt),
    };
  }

  if (like.target) {
    return {
      name: nonEmpty(like.target.name) ?? "Unknown",
      avatar: like.target.avatar,
      subtitle: isLikeTargetJob(like.target)
        ? nonEmpty(like.target.jobTitle)
        : null,
      targetType: like.targetType,
      badgeText: formatLikeBadgeText(like),
      likedAtLabel: formatMatchDate(like.createdAt),
    };
  }

  return {
    name: "Unknown",
    avatar: null,
    subtitle: null,
    targetType: like.targetType,
    badgeText: formatLikeBadgeText(like),
    likedAtLabel: formatMatchDate(like.createdAt),
  };
}
