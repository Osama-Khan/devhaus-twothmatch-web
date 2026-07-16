import type {
  Interview,
  InterviewLocation,
  InterviewMeetingType,
  InterviewStatus,
  InterviewViewerRole,
} from "@/features/interviews/types";

/** Display fields derived from an interview for the listing card */
export type InterviewCardDisplay = {
  name: string;
  avatar: string | null;
  subtitle: string | null;
  /** Formatted interview date, e.g. `15 Aug 2026` */
  dateLabel: string;
  /** Formatted interview time, e.g. `14:30` */
  timeLabel: string;
  meetingTypeLabel: string;
  locationLabel: string;
  notes: string | null;
  rescheduleRequested: boolean;
  /** Candidate-requested slot summary when a reschedule is pending */
  rescheduleRequestLabel: string | null;
  declined: boolean;
  declineReason: string | null;
};

function nonEmpty(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Title-case label for an interview status filter tab */
export function formatInterviewStatusLabel(status: InterviewStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

/** Label for the reschedule-requests invitations tab */
export function formatInterviewRequestsLabel(): string {
  return "Requests";
}

/** Display label for meeting type */
export function formatMeetingTypeLabel(type: InterviewMeetingType): string {
  return type;
}

/** Display label for location */
export function formatLocationLabel(location: InterviewLocation): string {
  return location;
}

/**
 * Format an interview calendar date (`YYYY-MM-DD`) as e.g. `15 Aug 2026`.
 * Parsed as a local calendar day to avoid UTC day-shift.
 */
export function formatInterviewDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  if (!match) {
    return date;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

/** Format interview time for display (pass-through of `HH:MM`) */
export function formatInterviewTime(time: string): string {
  return time.trim();
}

/**
 * Map an interview row to card display fields.
 * Practice viewers see the candidate; candidates see the practice.
 */
export function getInterviewCardDisplay(
  interview: Interview,
  viewerRole: InterviewViewerRole | null
): InterviewCardDisplay {
  const role =
    viewerRole ??
    (interview.Candidate
      ? "practice"
      : interview.Practice
        ? "candidate"
        : null);

  let name = "Unknown";
  let avatar: string | null = null;
  let subtitle: string | null = null;

  if (role === "practice" && interview.Candidate) {
    name =
      nonEmpty(interview.Candidate.CandidateProfile?.fullName) ?? "Candidate";
    avatar = interview.Candidate.avatar;
    subtitle = nonEmpty(interview.Candidate.CandidateProfile?.jobTitle);
  } else if (role === "candidate" && interview.Practice) {
    name = nonEmpty(interview.Practice.fullName) ?? "Practice";
    avatar = interview.Practice.avatar ?? null;
    subtitle = nonEmpty(interview.Practice.PracticeProfile?.clinicType);
  } else if (interview.Candidate) {
    name =
      nonEmpty(interview.Candidate.CandidateProfile?.fullName) ?? "Candidate";
    avatar = interview.Candidate.avatar;
    subtitle = nonEmpty(interview.Candidate.CandidateProfile?.jobTitle);
  } else if (interview.Practice) {
    name = nonEmpty(interview.Practice.fullName) ?? "Practice";
    avatar = interview.Practice.avatar ?? null;
    subtitle = nonEmpty(interview.Practice.PracticeProfile?.clinicType);
  }

  const rescheduleRequestLabel =
    interview.rescheduleRequested &&
    interview.rescheduleRequestedDate &&
    interview.rescheduleRequestedTime
      ? `${formatInterviewDate(interview.rescheduleRequestedDate)} at ${formatInterviewTime(interview.rescheduleRequestedTime)}`
      : null;

  return {
    name,
    avatar,
    subtitle,
    dateLabel: formatInterviewDate(interview.date),
    timeLabel: formatInterviewTime(interview.time),
    meetingTypeLabel: formatMeetingTypeLabel(interview.meetingType),
    locationLabel: formatLocationLabel(interview.location),
    notes: nonEmpty(interview.notes),
    rescheduleRequested: interview.rescheduleRequested,
    rescheduleRequestLabel,
    declined: interview.declined,
    declineReason: nonEmpty(interview.declineReason),
  };
}
