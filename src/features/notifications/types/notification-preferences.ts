/** Per-category notification toggles */
export type NotificationCategories = {
  matches: boolean;
  applications: boolean;
  payments: boolean;
  reminders: boolean;
  marketing: boolean;
  chat: boolean;
  system: boolean;
};

/** Notification delivery frequency */
export type NotificationFrequency = "instant" | "daily" | "weekly";

/** User notification preferences from GET/PUT `/notifications/preferences` */
export type NotificationPreferences = {
  id: string;
  userId: string;
  channelPush: boolean;
  channelEmail: boolean;
  channelSms: boolean;
  channelWhatsapp: boolean;
  channelInApp: boolean;
  categories: NotificationCategories;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  timezone: string;
  frequency: NotificationFrequency;
  createdAt: string;
  updatedAt: string;
};

/**
 * Partial update body for PUT `/notifications/preferences`.
 * Only sent fields are updated; `categories` merges with existing values.
 */
export type UpdateNotificationPreferencesRequest = {
  channelPush?: boolean;
  channelEmail?: boolean;
  channelSms?: boolean;
  channelWhatsapp?: boolean;
  channelInApp?: boolean;
  categories?: Partial<NotificationCategories>;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  timezone?: string;
  frequency?: NotificationFrequency;
};
