import { ONBOARDING_TOTAL_STEPS } from "@/features/onboarding/constants";

/**
 * Maps API `missingFields` paths to the earliest onboarding step that owns them.
 * Practice minima: clinicName/clinicTypeId, phoneNumber, locations.
 */
export function mapMissingFieldsToOnboardingStep(
  missingFields: string[]
): number {
  let earliest = ONBOARDING_TOTAL_STEPS;

  for (const field of missingFields) {
    const step = fieldToStep(field);
    if (step < earliest) {
      earliest = step;
    }
  }

  return earliest;
}

function fieldToStep(field: string): number {
  const normalized = field.trim().toLowerCase();

  if (
    normalized === "clinicname" ||
    normalized === "fullname" ||
    normalized === "clinictypeid" ||
    normalized === "clinictype" ||
    normalized.startsWith("media") ||
    normalized === "logo"
  ) {
    return 1;
  }

  if (
    normalized === "phonenumber" ||
    normalized === "website" ||
    normalized === "instagram" ||
    normalized === "facebook" ||
    normalized === "linkedin"
  ) {
    return 2;
  }

  if (
    normalized === "locations" ||
    normalized.startsWith("locations.") ||
    normalized === "location"
  ) {
    return 3;
  }

  if (
    normalized === "documentsrequiredids" ||
    normalized === "skillids" ||
    normalized === "softwareids"
  ) {
    return 4;
  }

  if (normalized === "cancellationpolicyid") {
    return 5;
  }

  return ONBOARDING_TOTAL_STEPS;
}
