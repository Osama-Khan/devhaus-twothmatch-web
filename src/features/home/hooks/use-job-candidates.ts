"use client";

import { useEffect, useState } from "react";
import type {
  CandidateFeedTab,
  CandidateListing,
} from "@/features/home/types/job-candidates";
import { jobsService } from "@/features/home/services/jobs-service";
import { mapCandidatesToJobListings } from "@/features/home/utils/map-candidate-to-job-listing";
import { isSuccessResponse } from "@/lib/types/response";

const PAGE_SIZE = 10;

type UseCandidateFeedResult = {
  candidates: CandidateListing[];
  isLoading: boolean;
  error: string | null;
};

/**
 * Fetches locum or permanent candidate listings for the home job feed.
 */
export function useJobCandidates(
  activeTab: CandidateFeedTab
): UseCandidateFeedResult {
  const [candidates, setCandidates] = useState<CandidateListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    const params = { page: 1, limit: PAGE_SIZE };

    if (activeTab === "locum") {
      void jobsService.browseLocumCandidates(params).then((response) => {
        if (cancelled) {
          return;
        }

        if (isSuccessResponse(response)) {
          setCandidates(
            mapCandidatesToJobListings("locum", response.data.candidates)
          );
        } else {
          setCandidates([]);
          setError(response.error);
        }

        setIsLoading(false);
      });
    } else {
      void jobsService.browsePermanentCandidates(params).then((response) => {
        if (cancelled) {
          return;
        }

        if (isSuccessResponse(response)) {
          setCandidates(
            mapCandidatesToJobListings("permanent", response.data.candidates)
          );
        } else {
          setCandidates([]);
          setError(response.error);
        }

        setIsLoading(false);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  return { candidates, isLoading, error };
}
