import type { IconSvgElement } from "@hugeicons/react";
import {
  Briefcase07Icon,
  Calendar03Icon,
  Clock01Icon,
  Coffee01Icon,
  CreditCardIcon,
  Location01Icon,
  MoneyBag02Icon,
  StopWatchIcon,
} from "@hugeicons/core-free-icons";
import type {
  MatchListItem,
  MatchListTarget,
  MatchTargetType,
} from "@/features/matches/types";
import type { UserRole } from "@/lib/types/entities";

/** Icon + label pill in the Job Details section */
export type MatchDetailPill = {
  key: string;
  icon: IconSvgElement;
  label: string;
};

/** Display fields derived from a match for the listing card */
export type MatchCardDisplay = {
  name: string;
  avatar: string | null;
  subtitle: string;
  /** Clinic type / secondary label under the role */
  badgeLabel: string | null;
  targetType: MatchTargetType;
  score: number;
  detailPills: MatchDetailPill[];
  showPpe: boolean;
  showDocsRequired: boolean;
  skills: string[];
  specialisms: string[];
  matchedAtLabel: string;
};

/** Format an ISO date as e.g. `30 Jun 2026` */
export function formatMatchDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

/** Format a decimal amount string as e.g. `£15.00/hr` */
export function formatMatchRateAmount(
  amount: string,
  interval?: string | null
): string {
  const value = Number.parseFloat(amount);
  const suffix =
    interval === "hour"
      ? "/hr"
      : interval === "day"
        ? "/day"
        : interval
          ? `/${interval}`
          : "";

  if (!Number.isFinite(value)) {
    return `£${amount.trim()}${suffix}`;
  }

  return `£${value.toFixed(2)}${suffix}`;
}

/** Format a permanent salary range string for display */
export function formatMatchSalary(salaryRange: string): string {
  const trimmed = salaryRange.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.startsWith("£")) {
    return trimmed;
  }

  const asNumber = Number.parseFloat(trimmed);
  if (Number.isFinite(asNumber)) {
    return `£${asNumber.toLocaleString("en-GB")}`;
  }

  return `£${trimmed}`;
}

/** Human label for a match target type */
export function formatMatchTargetTypeLabel(targetType: MatchTargetType): string {
  switch (targetType) {
    case "locum":
      return "Locum";
    case "permanent":
      return "Permanent";
    case "candidate":
      return "Candidate";
  }
}

function nonEmpty(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function pushPill(
  pills: MatchDetailPill[],
  key: string,
  icon: IconSvgElement,
  label: string | null
): void {
  if (!label) {
    return;
  }
  pills.push({ key, icon, label });
}

function buildLocumDetailPills(target: MatchListTarget): MatchDetailPill[] {
  const pills: MatchDetailPill[] = [];

  pushPill(pills, "location", Location01Icon, nonEmpty(target.location));

  if (nonEmpty(target.rate)) {
    pushPill(
      pills,
      "rate",
      MoneyBag02Icon,
      formatMatchRateAmount(target.rate!, target.rateInterval)
    );
  }

  if (nonEmpty(target.date)) {
    pushPill(
      pills,
      "date",
      Calendar03Icon,
      formatMatchDate(
        target.date!.includes("T")
          ? target.date!
          : `${target.date!}T12:00:00`
      )
    );
  }

  const timeRange =
    nonEmpty(target.timeStart) && nonEmpty(target.timeEnd)
      ? `${target.timeStart!.trim()} - ${target.timeEnd!.trim()}`
      : nonEmpty(target.time);
  pushPill(pills, "time", Clock01Icon, timeRange);

  if (target.breakDurationMins != null && target.breakDurationMins > 0) {
    pushPill(
      pills,
      "break",
      Coffee01Icon,
      `Break: ${target.breakDurationMins} mins`
    );
  }

  if (typeof target.isOvertimePaid === "boolean") {
    pushPill(
      pills,
      "overtime",
      StopWatchIcon,
      `OT: ${target.isOvertimePaid ? "Paid" : "UnPaid"}`
    );
  }

  pushPill(pills, "payment", CreditCardIcon, nonEmpty(target.paymentTerms));

  return pills;
}

function buildPermanentDetailPills(target: MatchListTarget): MatchDetailPill[] {
  const pills: MatchDetailPill[] = [];

  pushPill(pills, "location", Location01Icon, nonEmpty(target.location));

  if (nonEmpty(target.salaryRange)) {
    pushPill(
      pills,
      "salary",
      MoneyBag02Icon,
      formatMatchSalary(target.salaryRange!)
    );
  }

  if (nonEmpty(target.startDate)) {
    pushPill(
      pills,
      "date",
      Calendar03Icon,
      formatMatchDate(
        target.startDate!.includes("T")
          ? target.startDate!
          : `${target.startDate!}T12:00:00`
      )
    );
  }

  pushPill(pills, "hours", Clock01Icon, nonEmpty(target.workingHours));
  pushPill(pills, "contract", Briefcase07Icon, nonEmpty(target.contractType));

  return pills;
}

function buildDetailPills(match: MatchListItem): MatchDetailPill[] {
  if (match.targetType === "permanent") {
    return buildPermanentDetailPills(match.target);
  }
  if (match.targetType === "locum") {
    return buildLocumDetailPills(match.target);
  }
  return buildLocumDetailPills(match.target);
}

/**
 * Map a match list row to card display fields.
 * Candidates see the practice + job role; practices see the candidate.
 */
export function getMatchCardDisplay(
  match: MatchListItem,
  viewerRole: UserRole | undefined
): MatchCardDisplay {
  const isPracticeViewer = viewerRole === "practice";
  const roleLabel = nonEmpty(match.target.role) ?? "";
  const hasComplianceDocs =
    Array.isArray(match.target.complianceDocuments) &&
    match.target.complianceDocuments.length > 0;

  return {
    name: isPracticeViewer
      ? match.candidate.fullName
      : match.practice.name,
    avatar: isPracticeViewer
      ? match.candidate.avatar
      : match.practice.avatar,
    subtitle: isPracticeViewer
      ? match.candidate.jobTitle || roleLabel
      : roleLabel,
    badgeLabel: isPracticeViewer ? null : nonEmpty(match.practice.clinicType),
    targetType: match.targetType,
    score: match.score,
    detailPills: buildDetailPills(match),
    showPpe: match.target.ppeProvided === true,
    showDocsRequired:
      match.target.mandatoryDocsForBooking === true || hasComplianceDocs,
    skills: match.target.skills ?? [],
    specialisms: match.target.specialisms ?? [],
    matchedAtLabel: formatMatchDate(match.createdAt),
  };
}
