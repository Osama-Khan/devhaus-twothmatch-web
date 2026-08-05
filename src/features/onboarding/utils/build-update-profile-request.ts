import { clinicWebsiteSchema } from "@/features/onboarding/form/onboarding-step-schemas";
import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";
import type {
  UpdateProfileLocation,
  UpdateProfileMedia,
  UpdateProfileRequest,
} from "@/features/profile/types/update-profile-request";
import { UploadMediaKind } from "@/features/upload/types/upload-media";

type BuildUpdateProfileRequestOptions = {
  media?: UpdateProfileMedia[];
  /** When true, sets the one-way completion latch */
  profileCompletion?: boolean;
};

function optionalString(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function buildLocation(data: OnboardingFormData): UpdateProfileLocation {
  const location: UpdateProfileLocation = {
    address: data.address.trim(),
    postcode: data.postcode.trim(),
  };

  if (data.latitude != null && data.longitude != null) {
    location.latitude = data.latitude;
    location.longitude = data.longitude;
  }

  const phone = optionalString(data.locationPhone);
  if (phone) {
    location.phone = phone;
  }

  if (data.parking) {
    location.parking = "Available";
  }

  if (data.publicTransport) {
    location.publicTransport = "Available";
  }

  const practiceManagerName = optionalString(data.branchManagerName);
  if (practiceManagerName) {
    location.practiceManagerName = practiceManagerName;
  }

  const email = optionalString(data.branchManagerEmail);
  if (email) {
    location.email = email;
  }

  const practiceManagerPhone = optionalString(data.branchManagerContact);
  if (practiceManagerPhone) {
    location.practiceManagerPhone = practiceManagerPhone;
  }

  return location;
}

/** Builds media rows from persisted URLs already on the form. */
export function buildPersistedMedia(
  data: OnboardingFormData
): UpdateProfileMedia[] {
  const media: UpdateProfileMedia[] = [];

  for (const url of data.clinicPictureUrls) {
    media.push({ kind: UploadMediaKind.CLINIC_PHOTO, url });
  }

  if (data.logoUrl) {
    media.push({ kind: UploadMediaKind.LOGO, url: data.logoUrl });
  }

  return media;
}

/** Step 1 — clinic name, type, and optional media. */
export function buildOnboardingStep1Request(
  data: OnboardingFormData,
  media?: UpdateProfileMedia[]
): UpdateProfileRequest {
  const request: UpdateProfileRequest = {
    clinicName: data.clinicName.trim(),
    clinicTypeId: data.clinicType,
  };

  if (media?.length) {
    request.media = media;
  }

  return request;
}

/** Step 2 — contact, brand, and visibility. */
export function buildOnboardingStep2Request(
  data: OnboardingFormData
): UpdateProfileRequest {
  const websiteResult = clinicWebsiteSchema.safeParse(data.clinicWebsite);
  const website = websiteResult.success
    ? websiteResult.data
    : data.clinicWebsite.trim();

  const request: UpdateProfileRequest = {
    website,
    phoneNumber: data.phoneNumber.trim(),
    hideFromPublic: data.hideFromPublic,
  };

  const instagram = optionalString(data.instagram);
  if (instagram) {
    request.instagram = instagram;
  }

  const facebook = optionalString(data.facebook);
  if (facebook) {
    request.facebook = facebook;
  }

  const linkedin = optionalString(data.linkedin);
  if (linkedin) {
    request.linkedin = linkedin;
  }

  return request;
}

/** Step 3 — locations (replaces the whole collection). */
export function buildOnboardingStep3Request(
  data: OnboardingFormData
): UpdateProfileRequest {
  return {
    locations: [buildLocation(data)],
  };
}

/** Step 4 — compliance / requirements arrays. */
export function buildOnboardingStep4Request(
  data: OnboardingFormData
): UpdateProfileRequest {
  return {
    documentsRequiredIds: data.documentsRequiredIds,
    skillIds: data.skillIds,
    softwareIds: data.softwareIds,
  };
}

/** Step 5 — payments / cancellation policy. */
export function buildOnboardingStep5Request(
  data: OnboardingFormData
): UpdateProfileRequest {
  const request: UpdateProfileRequest = {};

  if (data.cancellationPolicyId.trim()) {
    request.cancellationPolicyId = data.cancellationPolicyId;
  }

  return request;
}

/** Step 6 — about, culture / work environment. */
export function buildOnboardingStep6Request(
  data: OnboardingFormData
): UpdateProfileRequest {
  const request: UpdateProfileRequest = {};

  const about = optionalString(data.about);
  if (about) {
    request.about = about;
  }

  const clinicCultureDescriptors = optionalString(
    data.clinicCultureDescriptors
  );
  if (clinicCultureDescriptors) {
    request.clinicCultureDescriptors = clinicCultureDescriptors;
  }

  if (data.benefitsOfferedIds.length > 0) {
    request.benefitsOfferedIds = data.benefitsOfferedIds;
  }

  if (data.workloadStyleId.trim()) {
    request.workloadStyleId = data.workloadStyleId;
  }

  return request;
}

/**
 * Partial PUT body for a single onboarding step (no completion latch).
 * Steps 1–6 only; preview/publish uses {@link buildPublishProfileRequest}.
 */
export function buildOnboardingStepRequest(
  step: number,
  data: OnboardingFormData,
  media?: UpdateProfileMedia[]
): UpdateProfileRequest | null {
  switch (step) {
    case 1:
      return buildOnboardingStep1Request(data, media);
    case 2:
      return buildOnboardingStep2Request(data);
    case 3:
      return buildOnboardingStep3Request(data);
    case 4:
      return buildOnboardingStep4Request(data);
    case 5:
      return buildOnboardingStep5Request(data);
    case 6:
      return buildOnboardingStep6Request(data);
    default:
      return null;
  }
}

/**
 * Maps onboarding form data into the PUT `/profile` request body for practice setup.
 * When `profileCompletion` is true, sets the completion latch for final submit.
 */
export function buildUpdateProfileRequest(
  data: OnboardingFormData,
  options: BuildUpdateProfileRequestOptions = {}
): UpdateProfileRequest {
  const websiteResult = clinicWebsiteSchema.safeParse(data.clinicWebsite);
  const website = websiteResult.success
    ? websiteResult.data
    : data.clinicWebsite.trim();

  const request: UpdateProfileRequest = {
    clinicName: data.clinicName.trim(),
    clinicTypeId: data.clinicType,
    website,
    phoneNumber: data.phoneNumber.trim(),
    hideFromPublic: data.hideFromPublic,
    locations: [buildLocation(data)],
    documentsRequiredIds: data.documentsRequiredIds,
    skillIds: data.skillIds,
    softwareIds: data.softwareIds,
  };

  if (data.cancellationPolicyId.trim()) {
    request.cancellationPolicyId = data.cancellationPolicyId;
  }

  const about = optionalString(data.about);
  if (about) {
    request.about = about;
  }

  const clinicCultureDescriptors = optionalString(
    data.clinicCultureDescriptors
  );
  if (clinicCultureDescriptors) {
    request.clinicCultureDescriptors = clinicCultureDescriptors;
  }

  if (data.benefitsOfferedIds.length > 0) {
    request.benefitsOfferedIds = data.benefitsOfferedIds;
  }

  if (data.workloadStyleId.trim()) {
    request.workloadStyleId = data.workloadStyleId;
  }

  const instagram = optionalString(data.instagram);
  if (instagram) {
    request.instagram = instagram;
  }

  const facebook = optionalString(data.facebook);
  if (facebook) {
    request.facebook = facebook;
  }

  const linkedin = optionalString(data.linkedin);
  if (linkedin) {
    request.linkedin = linkedin;
  }

  if (options.media?.length) {
    request.media = options.media;
  }

  if (options.profileCompletion === true) {
    request.profileCompletion = true;
  }

  return request;
}

/**
 * Full publish PUT body with `profileCompletion: true`.
 * Includes persisted + newly uploaded media when provided.
 */
export function buildPublishProfileRequest(
  data: OnboardingFormData,
  media?: UpdateProfileMedia[]
): UpdateProfileRequest {
  const mergedMedia = media?.length
    ? media
    : buildPersistedMedia(data);

  return buildUpdateProfileRequest(data, {
    media: mergedMedia.length ? mergedMedia : undefined,
    profileCompletion: true,
  });
}
