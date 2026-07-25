import type {
  CandidateFeedTab,
  CandidateListing,
  LocumCandidate,
  PermanentCandidate,
} from "@/features/home/types/feed-candidates";
import { formatDisplayDate } from "@/features/candidates/utils/format-candidate-display";
import {
  formatConfigRefName,
  formatConfigRefNames,
} from "@/features/profile/utils/format-config-ref";

/** Format distance in miles for feed card meta rows */
function formatDistanceMiles(distanceMiles: number): string {
  return `${distanceMiles.toFixed(1)} miles away`;
}

/** Format the first locum availability slot for display */
function formatAvailability(dateTime: string): string {
  return formatDisplayDate(dateTime);
}

/** Map a locum candidate API card to the center-feed listing shape */
export function mapLocumCandidateToFeedListing(
  candidate: LocumCandidate
): CandidateListing {
  const nextAvailability = candidate.availability[0];

  return {
    id: candidate.id,
    posterUserId: candidate.userId,
    isNew: false,
    posterName: candidate.fullName,
    avatar: candidate.avatar,
    title: formatConfigRefName(candidate.jobTitle) ?? "Candidate",
    rate: `£${candidate.rate.hourlyRate}/hr`,
    meta: [
      {
        label: "Distance",
        value: formatDistanceMiles(candidate.distanceMiles),
      },
      { label: "Location", value: candidate.location.address },
      {
        label: "Availability",
        value: nextAvailability
          ? formatAvailability(nextAvailability.dateTime)
          : "Not specified",
      },
      {
        label: "Working pattern",
        value:
          formatConfigRefNames(candidate.workingPatterns) ?? "Not specified",
      },
    ],
  };
}

/** Map a permanent candidate API card to the center-feed listing shape */
export function mapPermanentCandidateToFeedListing(
  candidate: PermanentCandidate
): CandidateListing {
  const salary =
    candidate.rate.salaryPreference ||
    `£${candidate.rate.payMin.toLocaleString("en-GB")} - £${candidate.rate.payMax.toLocaleString("en-GB")}`;

  return {
    id: candidate.id,
    posterUserId: candidate.userId,
    isNew: false,
    posterName: candidate.fullName,
    avatar: candidate.avatar,
    title: formatConfigRefName(candidate.jobTitle) ?? "Candidate",
    rate: salary,
    meta: [
      {
        label: "Distance",
        value: formatDistanceMiles(candidate.distanceMiles),
      },
      { label: "Location", value: candidate.location.address },
      { label: "Postcode", value: candidate.postcode },
      {
        label: "Working pattern",
        value:
          formatConfigRefNames(candidate.workingPatterns) ?? "Not specified",
      },
    ],
  };
}

/** Map API candidates to feed listings for the active tab */
export function mapCandidatesToFeedListings(
  tab: CandidateFeedTab,
  candidates: LocumCandidate[] | PermanentCandidate[]
): CandidateListing[] {
  if (tab === "locum") {
    return (candidates as LocumCandidate[]).map(mapLocumCandidateToFeedListing);
  }

  return (candidates as PermanentCandidate[]).map(
    mapPermanentCandidateToFeedListing
  );
}
