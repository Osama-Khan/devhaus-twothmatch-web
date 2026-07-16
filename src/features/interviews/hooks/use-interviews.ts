"use client";

import { useCallback, useEffect, useState } from "react";
import { interviewsService } from "@/features/interviews/services/interviews-service";
import type {
  Interview,
  InterviewStatus,
  InterviewViewerRole,
  InterviewsPagination,
} from "@/features/interviews/types";
import { isSuccessResponse } from "@/lib/types/response";

const PAGE_SIZE = 10;

type UseInterviewsOptions = {
  /** Filter status (default `confirmed`) */
  status?: InterviewStatus;
  /** When false, skip fetching (e.g. another tab is active) */
  enabled?: boolean;
};

type UseInterviewsResult = {
  interviews: Interview[];
  role: InterviewViewerRole | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  /** Replace a row after a successful mutation (accept, cancel, reschedule, etc.) */
  upsertInterview: (interview: Interview) => void;
  /** Remove a row from the local list (e.g. after decline/cancel when filtering pending) */
  removeInterview: (interviewId: string) => void;
};

/**
 * Fetches paginated interviews for the authenticated user with append-on-load-more.
 * Re-fetches when `status` changes.
 */
export function useInterviews(
  options: UseInterviewsOptions = {}
): UseInterviewsResult {
  const { status = "confirmed", enabled = true } = options;

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [role, setRole] = useState<InterviewViewerRole | null>(null);
  const [pagination, setPagination] = useState<InterviewsPagination | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [wasEnabled, setWasEnabled] = useState(enabled);

  if (enabled !== wasEnabled) {
    setWasEnabled(enabled);
    if (enabled) {
      setIsLoading(true);
    }
  }

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setInterviews([]);
    setRole(null);
    setPagination(null);
    setPage(1);

    void interviewsService
      .listInterviews({ status, page: 1, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled) {
          return;
        }

        if (isSuccessResponse(response)) {
          setInterviews(response.data.interviews);
          setRole(response.data.role);
          setPagination(response.data.pagination);
          setPage(response.data.pagination.page);
        } else {
          setInterviews([]);
          setRole(null);
          setPagination(null);
          setError(response.error);
        }

        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, refreshKey, enabled]);

  const loadMore = useCallback(() => {
    if (
      !enabled ||
      isLoadingMore ||
      !pagination ||
      page >= pagination.totalPages
    ) {
      return;
    }

    const nextPage = page + 1;

    setIsLoadingMore(true);
    setError(null);

    void interviewsService
      .listInterviews({ status, page: nextPage, limit: PAGE_SIZE })
      .then((response) => {
        if (isSuccessResponse(response)) {
          setInterviews((current) => [
            ...current,
            ...response.data.interviews,
          ]);
          setRole(response.data.role);
          setPagination(response.data.pagination);
          setPage(response.data.pagination.page);
        } else {
          setError(response.error);
        }

        setIsLoadingMore(false);
      });
  }, [enabled, isLoadingMore, page, pagination, status]);

  const refetch = useCallback(() => {
    if (!enabled) {
      return;
    }
    setRefreshKey((key) => key + 1);
  }, [enabled]);

  const upsertInterview = useCallback((interview: Interview) => {
    setInterviews((current) => {
      const index = current.findIndex((row) => row.id === interview.id);
      if (index === -1) {
        return [interview, ...current];
      }
      const next = [...current];
      next[index] = interview;
      return next;
    });
  }, []);

  const removeInterview = useCallback((interviewId: string) => {
    setInterviews((current) =>
      current.filter((interview) => interview.id !== interviewId)
    );
  }, []);

  const hasMore = pagination != null && page < pagination.totalPages;

  return {
    interviews,
    role,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    upsertInterview,
    removeInterview,
  };
}
