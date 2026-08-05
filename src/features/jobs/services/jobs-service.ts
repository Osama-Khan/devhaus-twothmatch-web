"use client";

import type {
  CreateJobRequest,
  CreateJobResponse,
  DeleteJobRequest,
  DeleteJobResponse,
  GetJobResponse,
  JobType,
  ListJobsParams,
  ListJobsResponse,
  UpdateJobRequest,
  UpdateJobResponse,
} from "@/features/jobs/types";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";

function buildJobsPath(params?: ListJobsParams): string {
  const searchParams = new URLSearchParams();

  if (params?.page != null) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null) {
    searchParams.set("limit", String(params.limit));
  }
  if (params?.status) {
    searchParams.set("status", params.status);
  }
  if (params?.type) {
    searchParams.set("type", params.type);
  }
  if (params?.isDraft != null) {
    searchParams.set("isDraft", String(params.isDraft));
  }

  const query = searchParams.toString();
  const base = externalApiRoutes.jobs._self.path;

  return query ? `${base}?${query}` : base;
}

function buildJobByIdPath(id: string, type?: JobType): string {
  const base = `${externalApiRoutes.jobs._self.path}/${encodeURIComponent(id)}`;
  if (!type) {
    return base;
  }
  return `${base}?type=${encodeURIComponent(type)}`;
}

/**
 * Client-side jobs service for practice-owned listings.
 * Auth + verified practice profile required for all endpoints.
 */
export const jobsService = {
  /**
   * GET `/jobs` — paginated list of the authenticated practice's jobs
   * (locum + permanent combined, newest first).
   */
  listJobs(
    params?: ListJobsParams
  ): Promise<AppResponseType<ListJobsResponse>> {
    return apiFetcher.get<ListJobsResponse>(buildJobsPath(params));
  },

  /**
   * GET `/jobs/:id` — full detail for a single job (owner can fetch drafts).
   * Optional `type` disambiguates locum vs permanent.
   */
  getJob(
    id: string,
    type?: JobType
  ): Promise<AppResponseType<GetJobResponse>> {
    return apiFetcher.get<GetJobResponse>(buildJobByIdPath(id, type));
  },

  /**
   * POST `/jobs` — create a locum shift or permanent job (201).
   * Body must include `type` (`locum` | `permanent`).
   * Drafts (`isDraft: true`) do not consume POSTS; publish does.
   */
  createJob(
    body: CreateJobRequest
  ): Promise<AppResponseType<CreateJobResponse>> {
    return apiFetcher.post<CreateJobResponse>(
      externalApiRoutes.jobs._self.path,
      body
    );
  },

  /**
   * PATCH `/jobs` — update an owned job.
   * Body must include `id`. Optional `type` disambiguates; otherwise both
   * tables are checked.
   */
  updateJob(
    body: UpdateJobRequest
  ): Promise<AppResponseType<UpdateJobResponse>> {
    return apiFetcher.patch<UpdateJobResponse>(
      externalApiRoutes.jobs._self.path,
      body
    );
  },

  /**
   * DELETE `/jobs` — delete an owned job and its related matches.
   * Body must include `id`. Optional `type` disambiguates.
   */
  deleteJob(
    body: DeleteJobRequest
  ): Promise<AppResponseType<DeleteJobResponse>> {
    return apiFetcher.delete<DeleteJobResponse>(
      externalApiRoutes.jobs._self.path,
      body
    );
  },
};
