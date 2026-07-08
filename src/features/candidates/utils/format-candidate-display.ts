/** Derive two-letter initials from a display name */
export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Human-readable label for snake_case or kebab-case API values */
export function formatLabelValue(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Format an ISO date or datetime for display */
export function formatDisplayDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: isoDate.includes("T") ? "short" : undefined,
  }).format(new Date(isoDate));
}

/** Format a pay range from min/max or hourly rate fields */
export function formatPayRange(options: {
  hourlyRate?: string | null;
  payMin?: number | null;
  payMax?: number | null;
  salaryPreference?: string | null;
  isNegotiable?: boolean;
}): string {
  const { hourlyRate, payMin, payMax, salaryPreference, isNegotiable } = options;

  if (hourlyRate) {
    return `£${hourlyRate}/hr${isNegotiable ? " (negotiable)" : ""}`;
  }

  if (salaryPreference) {
    return `${salaryPreference}${isNegotiable ? " (negotiable)" : ""}`;
  }

  if (payMin != null && payMax != null) {
    const min = payMin.toLocaleString("en-GB");
    const max = payMax.toLocaleString("en-GB");
    return `£${min} - £${max}${isNegotiable ? " (negotiable)" : ""}`;
  }

  if (payMin != null) {
    return `From £${payMin.toLocaleString("en-GB")}${isNegotiable ? " (negotiable)" : ""}`;
  }

  return isNegotiable ? "Negotiable" : "Not specified";
}
