"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  BrowseLocumCandidatesResponse,
  BrowsePermanentCandidatesResponse,
  CandidateFeedFilters,
  CandidateFeedTab,
  CandidateListing,
  FeedCandidatesPagination,
} from "@/features/home/types/feed-candidates";
import { feedService } from "@/features/home/services/feed-service";
import { mapCandidatesToFeedListings } from "@/features/home/utils/map-candidate-to-feed-listing";
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
 * Fetches locum or permanent candidate listings for the home feed,
 * with append-on-load-more pagination.
 */
export function useFeedCandidates(
  activeTab: CandidateFeedTab,
  filters?: CandidateFeedFilters | null
): UseCandidateFeedResult {
  const [candidates, setCandidates] = useState<CandidateListing[]>([]);
  const [pagination, setPagination] = useState<FeedCandidatesPagination | null>(
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
      const params = {
        page: pageNumber,
        limit: PAGE_SIZE,
        ...(filters ?? {}),
      };

      return tab === "locum"
        ? feedService.browseLocumCandidates(params)
        : feedService.browsePermanentCandidates(params);
    },
    [filters]
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
          mapCandidatesToFeedListings(activeTab, response.data.candidates)
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
  }, [activeTab, fetchPage, filters]);

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
          ...mapCandidatesToFeedListings(activeTab, response.data.candidates),
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
