import type { Event } from "@/features/events/types";

/** Format an event start time for list cards */
export function formatEventDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

/** Format start–end range for event detail */
export function formatEventDateRange(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const datePart = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(start);

  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (sameDay) {
    return `${datePart} · ${timeFormatter.format(start)} – ${timeFormatter.format(end)}`;
  }

  return `${formatEventDate(startTime)} – ${formatEventDate(endTime)}`;
}

/** Display price for paid events, or Free */
export function formatEventPrice(event: Pick<Event, "type" | "amount">): string {
  if (event.type === "Free" || event.amount === "0.00" || event.amount === "0") {
    return "Free";
  }

  const numeric = Number(event.amount);
  if (Number.isFinite(numeric)) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(numeric);
  }

  return `£${event.amount}`;
}

/** First cover image URL, if any */
export function getEventCoverImage(event: Pick<Event, "eventImages">): string | null {
  const url = event.eventImages.find((image) => image.trim().length > 0);
  return url ?? null;
}
