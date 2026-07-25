import type { ProfileConfigRef } from "@/features/profile/types/profile-shared";

/** Interview lifecycle status from `/interviews` */
export type InterviewStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

/** Meeting format for a scheduled interview */
export type InterviewMeetingType = "Video" | "In Person" | "Call";

/** Where the interview takes place */
export type InterviewLocation = "Online" | "Office";

/** JWT role returned with list responses */
export type InterviewViewerRole = "practice" | "candidate";

/** Nested candidate profile on interview payloads (practice view) */
export type InterviewCandidateProfile = {
  id: string;
  fullName: string;
  jobTitle: ProfileConfigRef | null;
};

/** Nested candidate user on interview payloads (practice view) */
export type InterviewCandidate = {
  id: string;
  email: string;
  CandidateProfile: InterviewCandidateProfile;
  avatar: string | null;
};

/** Nested practice profile on interview payloads (candidate view) */
export type InterviewPracticeProfile = {
  id: string;
  clinicType: ProfileConfigRef | null;
  phoneNumber: string;
};

/** Nested practice user on interview payloads (candidate view) */
export type InterviewPractice = {
  id: string;
  email: string;
  fullName: string;
  PracticeProfile: InterviewPracticeProfile;
  avatar?: string | null;
};

/**
 * Interview entity from `/interviews`.
 * List items include the counterparty: practice sees `Candidate`, candidate sees `Practice`.
 * Schedule (201) may include both.
 */
export type Interview = {
  id: string;
  practiceUserId: string;
  candidateUserId: string;
  meetingType: InterviewMeetingType;
  location: InterviewLocation;
  /** ISO date string `YYYY-MM-DD` */
  date: string;
  /** 24-hour `HH:MM` */
  time: string;
  status: InterviewStatus;
  notes: string | null;
  rescheduleRequested: boolean;
  /** When the candidate submitted a reschedule request (ISO datetime) */
  rescheduleRequestDate: string | null;
  rescheduleRequestReason: string | null;
  /** Candidate-requested date `YYYY-MM-DD` */
  rescheduleRequestedDate: string | null;
  /** Candidate-requested time `HH:MM` */
  rescheduleRequestedTime: string | null;
  declined: boolean;
  declinedAt: string | null;
  declineReason: string | null;
  createdAt: string;
  updatedAt: string;
  Candidate?: InterviewCandidate;
  Practice?: InterviewPractice;
};

/** Pagination metadata from GET `/interviews` */
export type InterviewsPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/** Query params for GET `/interviews` */
export type ListInterviewsParams = {
  /**
   * Filter status (default `pending`).
   * When `pending`, legacy `scheduled` rows are included and mapped to `pending`.
   */
  status?: InterviewStatus;
  /** Page number (default 1) */
  page?: number;
  /** Page size (default 10, max 20) */
  limit?: number;
};
