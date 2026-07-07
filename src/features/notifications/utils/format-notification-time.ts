import { formatDistanceToNowStrict } from "date-fns";

/**
 * Compact relative timestamp for notification rows (e.g. "1 hour ago", "2 days ago").
 */
export function formatNotificationTime(isoDate: string): string {
  return formatDistanceToNowStrict(new Date(isoDate), { addSuffix: true })
    .replace(/\bminute\b/, "min")
    .replace(/\bminutes\b/, "mins")
    .replace(/\bhour\b/, "hr")
    .replace(/\bhours\b/, "hrs");
}
