"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  BrowseLocumCandidatesResponse,
  BrowsePermanentCandidatesResponse,
  CandidateFeedTab,
  CandidateListing,
  JobCandidatesPagination,
} from "@/features/home/types/job-candidates";
import { jobsService } from "@/features/home/services/jobs-service";
import { mapCandidatesToJobListings } from "@/features/home/utils/map-candidate-to-job-listing";
import {
  isSuccessResponse,
  type AppResponseType,
} from "@/lib/types/response";

const PAGE_SIZE = 10;

type UseCandidateFeedResult = {
  candidates: CandidateListing[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
};

type BrowseCandidatesResponse =
  | BrowseLocumCandidatesResponse
  | BrowsePermanentCandidatesResponse;

/**
 * Fetches locum or permanent candidate listings for the home job feed,
 * with append-on-load-more pagination.
 */
export function useJobCandidates(
  activeTab: CandidateFeedTab
): UseCandidateFeedResult {
  const [candidates, setCandidates] = useState<CandidateListing[]>([]);
  const [pagination, setPagination] = useState<JobCandidatesPagination | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    (
      tab: CandidateFeedTab,
      pageNumber: number
    ): Promise<AppResponseType<BrowseCandidatesResponse>> => {
      const params = { page: pageNumber, limit: PAGE_SIZE };

      return tab === "locum"
        ? jobsService.browseLocumCandidates(params)
        : jobsService.browsePermanentCandidates(params);
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setCandidates([]);
    setPagination(null);
    setPage(1);

    void fetchPage(activeTab, 1).then((response) => {
      if (cancelled) {
        return;
      }

      if (isSuccessResponse(response)) {
        setCandidates(
          mapCandidatesToJobListings(activeTab, response.data.candidates)
        );
        setPagination(response.data.pagination);
        setPage(response.data.pagination.page);
      } else {
        setCandidates([]);
        setPagination(null);
        setError(response.error);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [activeTab, fetchPage]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !pagination || page >= pagination.totalPages) {
      return;
    }

    const nextPage = page + 1;

    setIsLoadingMore(true);
    setError(null);

    void fetchPage(activeTab, nextPage).then((response) => {
      if (isSuccessResponse(response)) {
        setCandidates((current) => [
          ...current,
          ...mapCandidatesToJobListings(activeTab, response.data.candidates),
        ]);
        setPagination(response.data.pagination);
        setPage(response.data.pagination.page);
      } else {
        setError(response.error);
      }

      setIsLoadingMore(false);
    });
  }, [activeTab, fetchPage, isLoadingMore, page, pagination]);

  const hasMore = pagination != null && page < pagination.totalPages;

  return {
    candidates,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
  };
}
