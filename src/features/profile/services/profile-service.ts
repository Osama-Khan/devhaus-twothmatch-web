"use client";

import type { ProfileResponse } from "@/features/profile/types/profile-get-response";
import type { UpdateProfileRequest } from "@/features/profile/types/update-profile-request";
import type { UpdateProfileResponse } from "@/features/profile/types/update-profile-response";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";

/**
 * Client-side profile service. Auth required for all endpoints.
 */
export const profileService = {
  /** GET `/profile` — returns the authenticated user's full profile payload */
  getProfile(): Promise<AppResponseType<ProfileResponse>> {
    return apiFetcher.get<ProfileResponse>(
      externalApiRoutes.profile._self.path
    );
  },

  /**
   * PUT `/profile` — create or update profile sections in a single request.
   * Send only the sections to update; array sections replace existing rows.
   */
  updateProfile(
    body: UpdateProfileRequest
  ): Promise<AppResponseType<UpdateProfileResponse>> {
    return apiFetcher.put<UpdateProfileResponse>(
      externalApiRoutes.profile._self.path,
      body
    );
  },
};
