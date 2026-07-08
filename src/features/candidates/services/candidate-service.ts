"use client";

import type { CandidateDetailResponse } from "@/features/candidates/types/candidate-detail";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";
import { createRoute } from "@/lib/utils/route";

function candidateByIdPath(candidateId: string): string {
  return createRoute(externalApiRoutes.candidates._self, { id: candidateId })
    .path;
}

/**
 * Client-side candidate service. Auth required for all endpoints.
 */
export const candidateService = {
  /** GET `/jobs/candidates/:id` — full candidate profile for practice detail view */
  getById(
    candidateId: string
  ): Promise<AppResponseType<CandidateDetailResponse>> {
    return apiFetcher.get<CandidateDetailResponse>(
      candidateByIdPath(candidateId)
    );
  },
};
