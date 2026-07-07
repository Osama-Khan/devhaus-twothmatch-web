"use client";

import type {
  NotificationHistoryParams,
  NotificationHistoryResponse,
  NotificationMessageResponse,
  NotificationPreferencesResponse,
  UnreadCountResponse,
  UpdateNotificationPreferencesRequest,
} from "@/features/notifications/types";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";

function notificationMarkReadPath(notificationId: string): string {
  return `${externalApiRoutes.notifications._self.path}/${notificationId}/markRead`;
}

function buildHistoryPath(params?: NotificationHistoryParams): string {
  const searchParams = new URLSearchParams();

  if (params?.page != null) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  const base = externalApiRoutes.notifications.history._self.path;

  return query ? `${base}?${query}` : base;
}

/**
 * Client-side notifications service. Auth required for all endpoints.
 */
export const notificationsService = {
  /**
   * GET `/notifications/history` — paginated in-app notification history,
   * newest first.
   */
  getHistory(
    params?: NotificationHistoryParams
  ): Promise<AppResponseType<NotificationHistoryResponse>> {
    return apiFetcher.get<NotificationHistoryResponse>(buildHistoryPath(params));
  },

  /**
   * GET `/notifications/unread-count` — count of unread in-app notifications
   * (`readAt` is null).
   */
  getUnreadCount(): Promise<AppResponseType<UnreadCountResponse>> {
    return apiFetcher.get<UnreadCountResponse>(
      externalApiRoutes.notifications.unreadCount._self.path
    );
  },

  /**
   * POST `/notifications/{notificationId}/markRead` — mark a single
   * notification as read.
   */
  markAsRead(
    notificationId: string
  ): Promise<AppResponseType<NotificationMessageResponse>> {
    return apiFetcher.post<NotificationMessageResponse>(
      notificationMarkReadPath(notificationId)
    );
  },

  /**
   * POST `/notifications/markAllRead` — mark every notification for the
   * authenticated user as read.
   */
  markAllAsRead(): Promise<AppResponseType<NotificationMessageResponse>> {
    return apiFetcher.post<NotificationMessageResponse>(
      externalApiRoutes.notifications.markAllRead._self.path
    );
  },

  /**
   * GET `/notifications/preferences` — returns notification delivery
   * preferences. Creates defaults if none exist.
   */
  getPreferences(): Promise<AppResponseType<NotificationPreferencesResponse>> {
    return apiFetcher.get<NotificationPreferencesResponse>(
      externalApiRoutes.notifications.preferences._self.path
    );
  },

  /**
   * PUT `/notifications/preferences` — partially update notification
   * preferences. Only sent fields are updated.
   */
  updatePreferences(
    body: UpdateNotificationPreferencesRequest
  ): Promise<AppResponseType<NotificationPreferencesResponse>> {
    return apiFetcher.put<NotificationPreferencesResponse>(
      externalApiRoutes.notifications.preferences._self.path,
      body
    );
  },
};
