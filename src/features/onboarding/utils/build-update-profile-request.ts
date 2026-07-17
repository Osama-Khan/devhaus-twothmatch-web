import { clinicWebsiteSchema } from "@/features/onboarding/form/onboarding-step-schemas";
import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";
import type {
  UpdateProfileLocation,
  UpdateProfileMedia,
  UpdateProfileRequest,
} from "@/features/profile/types/update-profile-request";

type BuildUpdateProfileRequestOptions = {
  media?: UpdateProfileMedia[];
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

  location.parking = data.parking;
  location.publicTransport = data.publicTransport;

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

/**
 * Maps onboarding form data into the PUT `/profile` request body for practice setup.
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

  if (options.media?.length) {
    request.media = options.media;
  }

  return request;
}
