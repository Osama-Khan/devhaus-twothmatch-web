import type {
  CandidateFeedTab,
  CandidateListing,
} from "@/features/home/types/job-candidates";
import type {
  LocumCandidate,
  PermanentCandidate,
} from "@/features/home/types/job-candidates";
import {
  formatDisplayDate,
  formatLabelValue,
  getInitials,
} from "@/features/candidates/utils/format-candidate-display";

/** Format distance in miles for job card meta rows */
function formatDistanceMiles(distanceMiles: number): string {
  return `${distanceMiles.toFixed(1)} miles away`;
}

/** Format the first locum availability slot for display */
function formatAvailability(dateTime: string): string {
  return formatDisplayDate(dateTime);
}

/** Map a locum candidate API card to the center-feed job listing shape */
export function mapLocumCandidateToJobListing(
  candidate: LocumCandidate
): CandidateListing {
  const nextAvailability = candidate.availability[0];

  return {
    id: candidate.id,
    posterUserId: candidate.userId,
    isNew: false,
    posterName: candidate.fullName,
    avatar: candidate.avatar,
    title: candidate.jobTitle,
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
        value: formatLabelValue(candidate.workingPattern),
      },
    ],
  };
}

/** Map a permanent candidate API card to the center-feed job listing shape */
export function mapPermanentCandidateToJobListing(
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
    title: candidate.jobTitle,
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
        value: formatLabelValue(candidate.workingPattern),
      },
    ],
  };
}

/** Map API candidates to feed listings for the active tab */
export function mapCandidatesToJobListings(
  tab: CandidateFeedTab,
  candidates: LocumCandidate[] | PermanentCandidate[]
): CandidateListing[] {
  if (tab === "locum") {
    return (candidates as LocumCandidate[]).map(mapLocumCandidateToJobListing);
  }

  return (candidates as PermanentCandidate[]).map(
    mapPermanentCandidateToJobListing
  );
}
