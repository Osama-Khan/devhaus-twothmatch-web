import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";
import { getClinicTypeLabel } from "@/features/onboarding/utils/get-clinic-type-label";

export type ProfilePreviewMetaItem = {
  label: string;
  value: string;
};

export type ProfilePreviewModel = {
  practiceName: string;
  locationSummary: string;
  rate: string;
  requirements: string[];
  meta: ProfilePreviewMetaItem[];
  hasLogo: boolean;
  logoInitial: string;
  photoCount: number;
};

/** Resolved config labels for id-backed onboarding fields */
export type ProfilePreviewLabels = {
  documentNames: string[];
  skillNames: string[];
  softwareNames: string[];
  benefitNames: string[];
};

function withFallback(value: string, fallback: string): string {
  return value.trim() || fallback;
}

function joinNames(names: string[]): string {
  return names.map((name) => name.trim()).filter(Boolean).join(", ");
}

function buildRequirements(
  data: OnboardingFormData,
  labels: ProfilePreviewLabels
): string[] {
  const items: string[] = [];
  const documents = joinNames(labels.documentNames);
  const skills = joinNames(labels.skillNames);
  const software = joinNames(labels.softwareNames);

  if (documents) {
    items.push(`${documents} required.`);
  }

  if (skills) {
    items.push(`${skills} proficiency required.`);
  }

  if (software) {
    items.push(`${software} proficiency required.`);
  }

  if (data.about.trim()) {
    items.push(data.about.trim());
  } else if (data.clinicCultureDescriptors.trim()) {
    items.push(data.clinicCultureDescriptors.trim());
  }

  if (data.cancellationPolicyName.trim()) {
    items.push(
      `Cancellation policy: ${data.cancellationPolicyName.trim()}.`
    );
  }

  return items;
}

function buildMeta(
  data: OnboardingFormData,
  labels: ProfilePreviewLabels
): ProfilePreviewMetaItem[] {
  const benefits = joinNames(labels.benefitNames);

  const items: ProfilePreviewMetaItem[] = [
    {
      label: "Location",
      value: withFallback(data.address, "Address not set"),
    },
    {
      label: "Clinic type",
      value: getClinicTypeLabel(data),
    },
    {
      label: "Contact",
      value: withFallback(
        data.locationPhone || data.phoneNumber,
        "Phone not set"
      ),
    },
    {
      label: "Parking",
      value: data.parking ? "Available" : "Not available",
    },
    {
      label: "Public transport",
      value: data.publicTransport ? "Available" : "Not available",
    },
    {
      label: "Benefits",
      value: withFallback(benefits, "Not specified"),
    },
    {
      label: "Workload",
      value: withFallback(data.workloadStyleName, "Not specified"),
    },
  ];

  return items.filter((item) => item.value !== "Not specified");
}

/**
 * Maps saved onboarding form data into the candidate-facing preview model.
 */
export function buildProfilePreview(
  data: OnboardingFormData,
  practiceName: string,
  labels: ProfilePreviewLabels = {
    documentNames: [],
    skillNames: [],
    softwareNames: [],
    benefitNames: [],
  }
): ProfilePreviewModel {
  const name = withFallback(data.clinicName || practiceName, "Your Practice");
  const locationSummary = [data.address, data.postcode]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");

  return {
    practiceName: name,
    locationSummary: withFallback(locationSummary, "Location not set"),
    rate: withFallback(data.defaultLocumRates, "Rates not set"),
    requirements: buildRequirements(data, labels),
    meta: buildMeta(data, labels),
    hasLogo:
      Boolean(data.logoUrl) || data.logoFileName !== "Choose File",
    logoInitial: name.charAt(0).toUpperCase(),
    photoCount: data.clinicPictureCount || data.clinicPictureUrls.length,
  };
}
