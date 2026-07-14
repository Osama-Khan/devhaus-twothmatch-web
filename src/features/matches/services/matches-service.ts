"use client";

import type {
  LikeTargetRequest,
  LikeTargetResponse,
  ListLikesResponse,
  ListMatchesParams,
  ListMatchesResponse,
} from "@/features/matches/types";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";

function buildPaginatedPath(base: string, params?: ListMatchesParams): string {
  const searchParams = new URLSearchParams();

  if (params?.page != null) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `${base}?${query}` : base;
}

/**
 * Client-side matches service for swipes, likes inbox, and mutual matches.
 * Auth + verified user required on all endpoints.
 */
export const matchesService = {
  /**
   * PUT `/matches` — like or pass a target (201).
   * `targetType`: `locum` | `permanent` | `candidate`.
   * Likes consume `FREE_SWIPES`; passes do not. `match` is null for passes
   * and for likes that have not yet been reciprocated.
   */
  likeTarget(
    body: LikeTargetRequest
  ): Promise<AppResponseType<LikeTargetResponse>> {
    return apiFetcher.put<LikeTargetResponse>(
      externalApiRoutes.matches._self.path,
      body
    );
  },

  /**
   * GET `/matches/likes` — paginated sent + received likes for the
   * authenticated user (`createdAt` desc). Received likes include `sender`;
   * sent likes omit it.
   */
  listLikes(
    params?: ListMatchesParams
  ): Promise<AppResponseType<ListLikesResponse>> {
    return apiFetcher.get<ListLikesResponse>(
      buildPaginatedPath(externalApiRoutes.matches.likes._self.path, params)
    );
  },

  /**
   * GET `/matches` — paginated mutual matches for the authenticated user
   * (`createdAt` desc). Only matches where both profiles are verified.
   * Each row includes nested `target`, `candidate`, and `practice`.
   */
  listMatches(
    params?: ListMatchesParams
  ): Promise<AppResponseType<ListMatchesResponse>> {
    return apiFetcher.get<ListMatchesResponse>(
      buildPaginatedPath(externalApiRoutes.matches._self.path, params)
    );
  },
};
