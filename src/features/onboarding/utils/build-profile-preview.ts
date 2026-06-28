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

function withFallback(value: string, fallback: string): string {
  return value.trim() || fallback;
}

function buildRequirements(data: OnboardingFormData): string[] {
  const items: string[] = [];

  if (data.documentsRequired.trim()) {
    items.push(`${data.documentsRequired} required.`);
  }

  if (data.yearsOfExperience.trim()) {
    items.push(`${data.yearsOfExperience} experience preferred.`);
  }

  if (data.skillsSoftwareRequired.trim()) {
    items.push(`${data.skillsSoftwareRequired} proficiency required.`);
  }

  if (data.clinicCultureDescriptors.trim()) {
    items.push(data.clinicCultureDescriptors.trim());
  }

  if (data.cancellationPolicy.trim()) {
    items.push(`Cancellation policy: ${data.cancellationPolicy.trim()}.`);
  }

  return items;
}

function buildMeta(data: OnboardingFormData): ProfilePreviewMetaItem[] {
  const items: ProfilePreviewMetaItem[] = [
    {
      label: "Location",
      value: withFallback(data.address, "Address not set"),
    },
    {
      label: "Clinic type",
      value: getClinicTypeLabel(data.clinicType),
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
      value: withFallback(data.parking, "Not specified"),
    },
    {
      label: "Public transport",
      value: withFallback(data.publicTransport, "Not specified"),
    },
    {
      label: "Benefits",
      value: withFallback(data.benefitsOffered, "Not specified"),
    },
    {
      label: "Workload",
      value: withFallback(data.workloadStyle, "Not specified"),
    },
  ];

  return items.filter((item) => item.value !== "Not specified");
}

/**
 * Maps saved onboarding form data into the candidate-facing preview model.
 */
export function buildProfilePreview(
  data: OnboardingFormData,
  practiceName: string
): ProfilePreviewModel {
  const name = withFallback(practiceName, "Your Practice");
  const locationSummary = [data.address, data.publicTransport]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");

  return {
    practiceName: name,
    locationSummary: withFallback(locationSummary, "Location not set"),
    rate: withFallback(data.defaultLocumRates, "Rates not set"),
    requirements: buildRequirements(data),
    meta: buildMeta(data),
    hasLogo: data.logoFileName !== "Choose File",
    logoInitial: name.charAt(0).toUpperCase(),
    photoCount: data.clinicPictureCount + data.teamPhotoCount,
  };
}
