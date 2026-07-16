import type {
  Interview,
  InterviewViewerRole,
  InterviewsPagination,
} from "@/features/interviews/types/interview";

/** Response from GET `/interviews` */
export type ListInterviewsResponse = {
  interviews: Interview[];
  role: InterviewViewerRole;
  pagination: InterviewsPagination;
};

/** Response from POST `/interviews` (201) */
export type ScheduleInterviewResponse = {
  message: string;
  interview: Interview;
};

/** Response from POST `/interviews/:id/accept` */
export type AcceptInterviewResponse = {
  message: string;
  interview: Interview;
};

/** Response from POST `/interviews/:id/complete` */
export type CompleteInterviewResponse = {
  message: string;
  interview: Interview;
};

/** Response from DELETE `/interviews/:id` (practice cancel) */
export type CancelInterviewResponse = {
  message: string;
  interview: Interview;
};

/** Response from DELETE `/interviews/:id` (candidate decline) */
export type DeclineInterviewResponse = {
  message: string;
  interview: Interview;
};

/** Response from POST `/interviews/:id/reschedule` (candidate request) */
export type RequestRescheduleResponse = {
  message: string;
  interview: Interview;
};

/** Response from POST `/interviews/:id/reschedule` (practice) */
export type RescheduleInterviewResponse = {
  message: string;
  interview: Interview;
};

/** Response from DELETE `/interviews/:id/reschedule` (practice) */
export type DeclineRescheduleResponse = {
  message: string;
};
