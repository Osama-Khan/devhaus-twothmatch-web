"use client";

import { useEffect, useState } from "react";
import {
  isPracticeProfileResponse,
} from "@/features/profile/types/profile-get-response";
import type { ProfileLocation } from "@/features/profile/types/profile-shared";
import { profileService } from "@/features/profile/services/profile-service";
import { isSuccessResponse } from "@/lib/types/response";

type UsePracticeLocationsResult = {
  locations: ProfileLocation[];
  isLoading: boolean;
  error: string | null;
};

/**
 * Loads practice locations from GET `/profile`.
 * Locations are not stored in Redux auth state.
 */
export function usePracticeLocations(): UsePracticeLocationsResult {
  const [locations, setLocations] = useState<ProfileLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    void profileService.getProfile().then((response) => {
      if (cancelled) {
        return;
      }

      if (!isSuccessResponse(response)) {
        setLocations([]);
        setError(response.error);
        setIsLoading(false);
        return;
      }

      if (!isPracticeProfileResponse(response.data)) {
        setLocations([]);
        setError("Practice locations are only available for practice profiles");
        setIsLoading(false);
        return;
      }

      setLocations(response.data.locations);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { locations, isLoading, error };
}
