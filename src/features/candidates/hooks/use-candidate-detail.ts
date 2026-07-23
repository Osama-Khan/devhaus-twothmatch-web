"use client";

import { useEffect, useState } from "react";
import { candidateService } from "@/features/candidates/services/candidate-service";
import type { CandidateDetailResponse } from "@/features/candidates/types/candidate-detail";
import {
  isPaymentRequiredResponse,
  isSuccessResponse,
} from "@/lib/types/response";

type UseCandidateDetailResult = {
  detail: CandidateDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  /** True when GET `/candidates/:id` was blocked by a payment / entitlement limit */
  isPaymentRequired: boolean;
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
  const [isPaymentRequired, setIsPaymentRequired] = useState(false);

  useEffect(() => {
    if (!candidateId) {
      setDetail(null);
      setIsLoading(false);
      setError(null);
      setIsPaymentRequired(false);
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setIsPaymentRequired(false);

    void candidateService.getById(candidateId).then((response) => {
      if (cancelled) {
        return;
      }

      if (isSuccessResponse(response)) {
        setDetail(response.data);
        setError(null);
        setIsPaymentRequired(false);
      } else {
        setDetail(null);
        setIsPaymentRequired(isPaymentRequiredResponse(response));
        setError(response.error);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [candidateId]);

  return { detail, isLoading, error, isPaymentRequired };
}
