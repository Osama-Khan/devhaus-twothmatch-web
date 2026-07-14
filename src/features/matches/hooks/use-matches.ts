"use client";

import { useCallback, useEffect, useState } from "react";
import { matchesService } from "@/features/matches/services/matches-service";
import type { MatchListItem, MatchesPagination } from "@/features/matches/types";
import { isSuccessResponse } from "@/lib/types/response";

const PAGE_SIZE = 10;

type UseMatchesResult = {
  matches: MatchListItem[];
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
};

/**
 * Fetches the authenticated user's mutual matches with append-on-load-more.
 */
export function useMatches(): UseMatchesResult {
  const [matches, setMatches] = useState<MatchListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<MatchesPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setMatches([]);
    setTotal(0);
    setPagination(null);
    setPage(1);

    void matchesService
      .listMatches({ page: 1, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled) {
          return;
        }

        if (isSuccessResponse(response)) {
          setMatches(response.data.matches);
          setTotal(response.data.total);
          setPagination(response.data.pagination);
          setPage(response.data.pagination.page);
        } else {
          setMatches([]);
          setTotal(0);
          setPagination(null);
          setError(response.error);
        }

        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !pagination || page >= pagination.totalPages) {
      return;
    }

    const nextPage = page + 1;

    setIsLoadingMore(true);
    setError(null);

    void matchesService
      .listMatches({ page: nextPage, limit: PAGE_SIZE })
      .then((response) => {
        if (isSuccessResponse(response)) {
          setMatches((current) => [...current, ...response.data.matches]);
          setTotal(response.data.total);
          setPagination(response.data.pagination);
          setPage(response.data.pagination.page);
        } else {
          setError(response.error);
        }

        setIsLoadingMore(false);
      });
  }, [isLoadingMore, page, pagination]);

  const refetch = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  const hasMore = pagination != null && page < pagination.totalPages;

  return {
    matches,
    total,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
  };
}
