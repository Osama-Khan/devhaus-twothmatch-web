import type { LocumJobFormData } from "@/features/jobs/types/locum-job-form";
import { parseTimeToMinutes } from "@/features/jobs/utils/locum-shift-duration";

/** Format `HH:MM` as e.g. `10:00 AM` */
export function formatTime12h(time: string): string {
  const minutes = parseTimeToMinutes(time);
  if (minutes == null) {
    return time;
  }

  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${String(mins).padStart(2, "0")} ${period}`;
}

/** Format a locum form rate for preview (`£16/hr` or `£220/day`) */
export function formatLocumFormRate(data: LocumJobFormData): string {
  const amount = Number.parseFloat(data.rate);
  const suffix =
    data.rateInterval === "hour"
      ? "/hr"
      : data.rateInterval === "day"
        ? "/day"
        : "";

  if (!Number.isFinite(amount)) {
    return data.rate ? `£${data.rate}${suffix}` : "—";
  }

  return `£${amount}${suffix}`;
}

/** Human label for rate interval */
export function formatRateIntervalLabel(
  rateInterval: LocumJobFormData["rateInterval"]
): string {
  if (rateInterval === "hour") return "Hourly";
  if (rateInterval === "day") return "Daily";
  return "—";
}
