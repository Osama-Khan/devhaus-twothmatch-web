"use client";

import type {
  BrowseFeedCandidatesParams,
  BrowseLocumCandidatesResponse,
  BrowsePermanentCandidatesResponse,
} from "@/features/home/types/feed-candidates";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";

function buildCandidatesPath(
  basePath: string,
  params?: BrowseFeedCandidatesParams
): string {
  if (!params) {
    return basePath;
  }

  const searchParams = new URLSearchParams();

  if (params.page != null) {
    searchParams.set("page", String(params.page));
  }
  if (params.limit != null) {
    searchParams.set("limit", String(params.limit));
  }
  if (params.workingPattern) {
    searchParams.set("workingPattern", params.workingPattern);
  }
  if (params.payRangeMin != null) {
    searchParams.set("payRangeMin", String(params.payRangeMin));
  }
  if (params.payRangeMax != null) {
    searchParams.set("payRangeMax", String(params.payRangeMax));
  }
  if (params.salaryPreferenceMin != null) {
    searchParams.set("salaryPreferenceMin", String(params.salaryPreferenceMin));
  }
  if (params.salaryPreferenceMax != null) {
    searchParams.set("salaryPreferenceMax", String(params.salaryPreferenceMax));
  }
  if (params.searchRadius != null) {
    searchParams.set("searchRadius", String(params.searchRadius));
  }
  if (params.latitude != null) {
    searchParams.set("latitude", String(params.latitude));
  }
  if (params.longitude != null) {
    searchParams.set("longitude", String(params.longitude));
  }

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/**
 * Client-side feed browse service. Auth required for all endpoints.
 */
export const feedService = {
  /** GET `/feed/candidates/locum` — browse verified locum candidates */
  browseLocumCandidates(
    params?: BrowseFeedCandidatesParams
  ): Promise<AppResponseType<BrowseLocumCandidatesResponse>> {
    return apiFetcher.get<BrowseLocumCandidatesResponse>(
      buildCandidatesPath(
        externalApiRoutes.feed.candidates.locum._self.path,
        params
      )
    );
  },

  /** GET `/feed/candidates/permanent` — browse verified permanent candidates */
  browsePermanentCandidates(
    params?: BrowseFeedCandidatesParams
  ): Promise<AppResponseType<BrowsePermanentCandidatesResponse>> {
    return apiFetcher.get<BrowsePermanentCandidatesResponse>(
      buildCandidatesPath(
        externalApiRoutes.feed.candidates.permanent._self.path,
        params
      )
    );
  },
};
