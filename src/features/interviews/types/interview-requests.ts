import type {
  InterviewLocation,
  InterviewMeetingType,
} from "@/features/interviews/types/interview";

/** Body for POST `/interviews` (practice schedule) */
export type ScheduleInterviewRequest = {
  candidateUserId: string;
  meetingType: InterviewMeetingType;
  location: InterviewLocation;
  /** ISO date string `YYYY-MM-DD` */
  date: string;
  /** 24-hour `HH:MM` */
  time: string;
  notes?: string;
};

/** Body for DELETE `/interviews/:id` when the candidate declines */
export type DeclineInterviewRequest = {
  reason: string;
};

/** Body for POST `/interviews/:id/reschedule` (candidate request) */
export type RequestRescheduleRequest = {
  /** ISO date string `YYYY-MM-DD` */
  requestedDate: string;
  /** 24-hour `HH:MM` */
  requestedTime: string;
  reason: string;
};

/**
 * Body for POST `/interviews/:id/reschedule` (practice).
 * Omit `date`/`time` to approve a pending candidate request as-is.
 */
export type RescheduleInterviewRequest = {
  /** ISO date string `YYYY-MM-DD` */
  date?: string;
  /** 24-hour `HH:MM` */
  time?: string;
};
