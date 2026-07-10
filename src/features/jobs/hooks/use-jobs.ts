"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  JobListItem,
  JobsPagination,
  ListJobsParams,
} from "@/features/jobs/types";
import { jobsService } from "@/features/jobs/services/jobs-service";
import { isSuccessResponse } from "@/lib/types/response";

const PAGE_SIZE = 10;

type UseJobsResult = {
  jobs: JobListItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
};

/**
 * Fetches the authenticated practice's job listings with append-on-load-more.
 */
export function useJobs(params?: Omit<ListJobsParams, "page" | "limit">): UseJobsResult {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [pagination, setPagination] = useState<JobsPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const status = params?.status;
  const type = params?.type;

  const fetchPage = useCallback(
    (pageNumber: number) => {
      return jobsService.listJobs({
        page: pageNumber,
        limit: PAGE_SIZE,
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
      });
    },
    [status, type]
  );

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setJobs([]);
    setPagination(null);
    setPage(1);

    void fetchPage(1).then((response) => {
      if (cancelled) {
        return;
      }

      if (isSuccessResponse(response)) {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
        setPage(response.data.pagination.page);
      } else {
        setJobs([]);
        setPagination(null);
        setError(response.error);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [fetchPage, refreshKey]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !pagination || page >= pagination.totalPages) {
      return;
    }

    const nextPage = page + 1;

    setIsLoadingMore(true);
    setError(null);

    void fetchPage(nextPage).then((response) => {
      if (isSuccessResponse(response)) {
        setJobs((current) => [...current, ...response.data.jobs]);
        setPagination(response.data.pagination);
        setPage(response.data.pagination.page);
      } else {
        setError(response.error);
      }

      setIsLoadingMore(false);
    });
  }, [fetchPage, isLoadingMore, page, pagination]);

  const refetch = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  const hasMore = pagination != null && page < pagination.totalPages;

  return {
    jobs,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
  };
}
