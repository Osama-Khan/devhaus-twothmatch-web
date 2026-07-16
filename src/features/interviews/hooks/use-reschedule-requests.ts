"use client";

import { useCallback, useEffect, useState } from "react";
import { interviewsService } from "@/features/interviews/services/interviews-service";
import type {
  Interview,
  InterviewViewerRole,
  InterviewsPagination,
} from "@/features/interviews/types";
import { isSuccessResponse } from "@/lib/types/response";

const PAGE_SIZE = 20;

type UseRescheduleRequestsOptions = {
  /** When false, skip fetching (e.g. another tab is active) */
  enabled?: boolean;
};

type UseRescheduleRequestsResult = {
  interviews: Interview[];
  role: InterviewViewerRole | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  upsertInterview: (interview: Interview) => void;
  removeInterview: (interviewId: string) => void;
};

function withRescheduleRequest(interview: Interview): boolean {
  return interview.rescheduleRequested === true;
}

/**
 * Fetches pending interviews and surfaces rows with an open reschedule request.
 * Paginates the underlying pending list; only matching rows are shown.
 */
export function useRescheduleRequests(
  options: UseRescheduleRequestsOptions = {}
): UseRescheduleRequestsResult {
  const { enabled = true } = options;

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
      .listInterviews({ status: "pending", page: 1, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled) {
          return;
        }

        if (isSuccessResponse(response)) {
          setInterviews(response.data.interviews.filter(withRescheduleRequest));
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
  }, [refreshKey, enabled]);

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
      .listInterviews({ status: "pending", page: nextPage, limit: PAGE_SIZE })
      .then((response) => {
        if (isSuccessResponse(response)) {
          const next = response.data.interviews.filter(withRescheduleRequest);
          setInterviews((current) => {
            const seen = new Set(current.map((row) => row.id));
            return [
              ...current,
              ...next.filter((row) => !seen.has(row.id)),
            ];
          });
          setRole(response.data.role);
          setPagination(response.data.pagination);
          setPage(response.data.pagination.page);
        } else {
          setError(response.error);
        }

        setIsLoadingMore(false);
      });
  }, [enabled, isLoadingMore, page, pagination]);

  const refetch = useCallback(() => {
    if (!enabled) {
      return;
    }
    setRefreshKey((key) => key + 1);
  }, [enabled]);

  const upsertInterview = useCallback((interview: Interview) => {
    setInterviews((current) => {
      if (!withRescheduleRequest(interview)) {
        return current.filter((row) => row.id !== interview.id);
      }

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
