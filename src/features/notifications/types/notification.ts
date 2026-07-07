/** Single in-app notification row from GET `/notifications/history` */
export type Notification = {
  id: string;
  userId: string;
  eventId?: string;
  type: string;
  category: string;
  channel: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  fcmMessageId?: string | null;
  readAt: string | null;
  createdAt: string;
};

/** Pagination metadata returned with notification history */
export type NotificationPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/** Query params for GET `/notifications/history` */
export type NotificationHistoryParams = {
  /** Page number (default 1) */
  page?: number;
  /** Page size (default 10, max 20) */
  limit?: number;
};
