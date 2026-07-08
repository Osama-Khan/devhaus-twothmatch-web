"use client";

import { useEffect, useState } from "react";
import { candidateService } from "@/features/candidates/services/candidate-service";
import type { CandidateDetailResponse } from "@/features/candidates/types/candidate-detail";
import { isSuccessResponse } from "@/lib/types/response";

type UseCandidateDetailResult = {
  detail: CandidateDetailResponse | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * Fetches full candidate profile when a browse card is selected.
 */
export function useCandidateDetail(
  candidateId: string | null
): UseCandidateDetailResult {
  const [detail, setDetail] = useState<CandidateDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!candidateId) {
      setDetail(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setError(null);

    void candidateService.getById(candidateId).then((response) => {
      if (cancelled) {
        return;
      }

      if (isSuccessResponse(response)) {
        setDetail(response.data);
      } else {
        setDetail(null);
        setError(response.error);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [candidateId]);

  return { detail, isLoading, error };
}
