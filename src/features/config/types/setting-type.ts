/** Known `app_settings.key` values for public settings lookups */
export const SETTING_TYPES = [
  "ios_warning_app_version",
  "android_supported_app_version",
  "ios_error_app_version",
  "android_error_app_version",
  "ios_supported_app_version",
  "privacy_policy",
  "android_warning_app_version",
] as const;

/** Snake_case setting key accepted by `GET /v2/settings/{type}` */
export type SettingType = (typeof SETTING_TYPES)[number];
