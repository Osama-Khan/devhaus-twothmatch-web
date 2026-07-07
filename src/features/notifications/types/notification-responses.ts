import type {
  Notification,
  NotificationPagination,
} from "@/features/notifications/types/notification";
import type { NotificationPreferences } from "@/features/notifications/types/notification-preferences";

/** Response from GET `/notifications/history` */
export type NotificationHistoryResponse = {
  notifications: Notification[];
  pagination: NotificationPagination;
};

/** Response from GET `/notifications/unread-count` */
export type UnreadCountResponse = {
  count: number;
};

/** Response from POST mark-read endpoints */
export type NotificationMessageResponse = {
  message: string;
};

/** Response from GET/PUT `/notifications/preferences` */
export type NotificationPreferencesResponse = {
  preferences: NotificationPreferences;
};
