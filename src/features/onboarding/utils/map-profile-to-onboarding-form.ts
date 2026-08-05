import { ONBOARDING_TOTAL_STEPS } from "@/features/onboarding/constants";
import {
  createInitialOnboardingFormData,
  type OnboardingFormData,
} from "@/features/onboarding/types/onboarding-form";
import { isOnboardingStepComplete } from "@/features/onboarding/utils/is-onboarding-step-complete";
import type { PracticeProfileResponse } from "@/features/profile/types/profile-get-response";
import { UploadMediaKind } from "@/features/upload/types/upload-media";

function parseCoordinate(value: string | number | null | undefined): number | null {
  if (value == null || value === "") {
    return null;
  }
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Maps a practice GET `/profile` response into onboarding form state for resume.
 */
export function mapProfileToOnboardingForm(
  response: PracticeProfileResponse
): OnboardingFormData {
  const data = createInitialOnboardingFormData();
  const profile = response.profile;
  const location = response.locations[0];
  const compliance = response.compliance;
  const culture = response.culture;
  const payment = response.payment;

  if (profile) {
    data.clinicName = profile.fullName ?? "";
    data.clinicType = profile.clinicType?.id ?? "";
    data.clinicTypeName = profile.clinicType?.name ?? "";
    data.clinicWebsite = profile.website ?? "";
    data.instagram = profile.instagram ?? "";
    data.facebook = profile.facebook ?? "";
    data.linkedin = profile.linkedin ?? "";
    data.phoneNumber = profile.phoneNumber ?? "";
    data.hideFromPublic = profile.hideFromPublic;
    data.about = profile.about ?? "";
  }

  const logo = response.media.find(
    (item) => item.kind === UploadMediaKind.LOGO
  );
  if (logo?.url) {
    data.logoUrl = logo.url;
    data.logoFileName = "Logo uploaded";
  }

  const clinicPhotos = response.media.filter(
    (item) => item.kind === UploadMediaKind.CLINIC_PHOTO
  );
  data.clinicPictureUrls = clinicPhotos.map((item) => item.url);
  data.clinicPictureCount = data.clinicPictureUrls.length;

  if (location) {
    data.address = location.address ?? "";
    data.postcode = location.postcode ?? "";
    data.latitude = parseCoordinate(location.latitude);
    data.longitude = parseCoordinate(location.longitude);
    data.locationPhone = location.phone ?? "";
    data.parking = Boolean(location.parking);
    data.publicTransport = Boolean(location.publicTransport);
    data.branchManagerName = location.practiceManagerName ?? "";
    data.branchManagerContact = location.practiceManagerPhone ?? "";
    data.branchManagerEmail = location.email ?? "";
  }

  if (compliance) {
    data.documentsRequiredIds = compliance.documentsRequired.map(
      (item) => item.id
    );
    data.skillIds = compliance.skills.map((item) => item.id);
    data.softwareIds = compliance.software.map((item) => item.id);
  }

  if (payment?.cancellationPolicy) {
    data.cancellationPolicyId = payment.cancellationPolicy.id;
    data.cancellationPolicyName = payment.cancellationPolicy.name;
  }

  if (culture) {
    data.clinicCultureDescriptors = culture.clinicCultureDescriptors ?? "";
    data.benefitsOfferedIds = culture.benefitsOffered.map((item) => item.id);
    data.workloadStyleId = culture.workloadStyle?.id ?? "";
    data.workloadStyleName = culture.workloadStyle?.name ?? "";
  }

  return data;
}

/**
 * Returns the first incomplete onboarding step (1-based), or the preview step
 * when all content steps are complete.
 */
export function getFirstIncompleteOnboardingStep(
  data: OnboardingFormData
): number {
  for (let step = 1; step < ONBOARDING_TOTAL_STEPS; step += 1) {
    if (!isOnboardingStepComplete(step, data)) {
      return step;
    }
  }
  return ONBOARDING_TOTAL_STEPS;
}
