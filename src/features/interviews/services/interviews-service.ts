"use client";

import type {
  AcceptInterviewResponse,
  CancelInterviewResponse,
  CompleteInterviewResponse,
  DeclineInterviewRequest,
  DeclineInterviewResponse,
  DeclineRescheduleResponse,
  ListInterviewsParams,
  ListInterviewsResponse,
  RequestRescheduleRequest,
  RequestRescheduleResponse,
  RescheduleInterviewRequest,
  RescheduleInterviewResponse,
  ScheduleInterviewRequest,
  ScheduleInterviewResponse,
} from "@/features/interviews/types";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";
import { createRoute } from "@/lib/utils/route";

function buildListPath(params?: ListInterviewsParams): string {
  const searchParams = new URLSearchParams();

  if (params?.status) {
    searchParams.set("status", params.status);
  }
  if (params?.page != null) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  const base = externalApiRoutes.interviews._self.path;

  return query ? `${base}?${query}` : base;
}

function interviewByIdPath(interviewId: string): string {
  return createRoute(externalApiRoutes.interviews.byId._self, {
    id: interviewId,
  }).path;
}

function acceptInterviewPath(interviewId: string): string {
  return createRoute(externalApiRoutes.interviews.accept._self, {
    id: interviewId,
  }).path;
}

function completeInterviewPath(interviewId: string): string {
  return createRoute(externalApiRoutes.interviews.complete._self, {
    id: interviewId,
  }).path;
}

function rescheduleInterviewPath(interviewId: string): string {
  return createRoute(externalApiRoutes.interviews.reschedule._self, {
    id: interviewId,
  }).path;
}

/**
 * Client-side interviews service for scheduling and lifecycle actions.
 * Auth + verified user required on all endpoints. Role is detected from JWT.
 */
export const interviewsService = {
  /**
   * GET `/interviews` — paginated interviews for the authenticated user
   * (`date` ASC, `time` ASC). Default `status` is `pending` (includes legacy
   * `scheduled` rows mapped to `pending`). Practice sees `Candidate`; candidate
   * sees `Practice`.
   */
  listInterviews(
    params?: ListInterviewsParams
  ): Promise<AppResponseType<ListInterviewsResponse>> {
    return apiFetcher.get<ListInterviewsResponse>(buildListPath(params));
  },

  /**
   * POST `/interviews` — schedule an interview (201). **Practice only**;
   * requires `INTERVIEWS` entitlement.
   */
  scheduleInterview(
    body: ScheduleInterviewRequest
  ): Promise<AppResponseType<ScheduleInterviewResponse>> {
    return apiFetcher.post<ScheduleInterviewResponse>(
      externalApiRoutes.interviews._self.path,
      body
    );
  },

  /**
   * POST `/interviews/:id/accept` — accept a pending interview.
   * **Candidate only**. Idempotent if already confirmed.
   */
  acceptInterview(
    interviewId: string
  ): Promise<AppResponseType<AcceptInterviewResponse>> {
    return apiFetcher.post<AcceptInterviewResponse>(
      acceptInterviewPath(interviewId)
    );
  },

  /**
   * POST `/interviews/:id/complete` — mark a confirmed interview completed.
   * **Practice or candidate** (must own the interview). Idempotent if already
   * completed.
   */
  completeInterview(
    interviewId: string
  ): Promise<AppResponseType<CompleteInterviewResponse>> {
    return apiFetcher.post<CompleteInterviewResponse>(
      completeInterviewPath(interviewId)
    );
  },

  /**
   * DELETE `/interviews/:id` — cancel a sent interview.
   * **Practice only**. Allowed for `pending` or `confirmed`.
   */
  cancelInterview(
    interviewId: string
  ): Promise<AppResponseType<CancelInterviewResponse>> {
    return apiFetcher.delete<CancelInterviewResponse>(
      interviewByIdPath(interviewId)
    );
  },

  /**
   * DELETE `/interviews/:id` — decline a pending interview request.
   * **Candidate only**. Body includes `reason`.
   */
  declineInterview(
    interviewId: string,
    body: DeclineInterviewRequest
  ): Promise<AppResponseType<DeclineInterviewResponse>> {
    return apiFetcher.delete<DeclineInterviewResponse>(
      interviewByIdPath(interviewId),
      body
    );
  },

  /**
   * POST `/interviews/:id/reschedule` — request a new date/time.
   * **Candidate only**.
   */
  requestReschedule(
    interviewId: string,
    body: RequestRescheduleRequest
  ): Promise<AppResponseType<RequestRescheduleResponse>> {
    return apiFetcher.post<RequestRescheduleResponse>(
      rescheduleInterviewPath(interviewId),
      body
    );
  },

  /**
   * POST `/interviews/:id/reschedule` — reschedule or approve a pending
   * candidate request. **Practice only**. Omit `date`/`time` to use the
   * requested slot.
   */
  rescheduleInterview(
    interviewId: string,
    body?: RescheduleInterviewRequest
  ): Promise<AppResponseType<RescheduleInterviewResponse>> {
    return apiFetcher.post<RescheduleInterviewResponse>(
      rescheduleInterviewPath(interviewId),
      body ?? {}
    );
  },

  /**
   * DELETE `/interviews/:id/reschedule` — decline a candidate's pending
   * reschedule request. **Practice only**.
   */
  declineReschedule(
    interviewId: string
  ): Promise<AppResponseType<DeclineRescheduleResponse>> {
    return apiFetcher.delete<DeclineRescheduleResponse>(
      rescheduleInterviewPath(interviewId)
    );
  },
};
