import { buildUpdateProfileRequest } from "@/features/onboarding/utils/build-update-profile-request";
import { refreshAuthUserFromProfile } from "@/features/auth/utils/refresh-auth-user-from-profile";
import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";
import type { OnboardingPublishStep } from "@/features/onboarding/types/onboarding-publish-step";
import { profileService } from "@/features/profile/services/profile-service";
import type { UpdateProfileMedia } from "@/features/profile/types/update-profile-request";
import { uploadService } from "@/features/upload/services/upload-service";
import {
  getUploadedMediaItems,
  UploadMediaKind,
} from "@/features/upload/types/upload-media";
import type { AppDispatch } from "@/lib/store";
import type { User } from "@/lib/types/entities";
import { isSuccessResponse } from "@/lib/types/response";

function toUpdateProfileMedia(
  items: ReturnType<typeof getUploadedMediaItems>
): UpdateProfileMedia[] {
  return items.map((item) => ({
    kind: item.kind,
    url: item.url,
  }));
}

/**
 * Uploads onboarding media, saves the practice profile, and reports progress
 * through the publish dialog steps.
 */
export async function publishOnboarding(
  data: OnboardingFormData,
  onStepChange: (step: OnboardingPublishStep) => void,
  dispatch: AppDispatch,
  getUser: () => User | null
): Promise<{ error?: string; user?: User }> {
  onStepChange("clinic-images");

  const uploadedMedia: UpdateProfileMedia[] = [];

  if (data.clinicPictureFiles.length > 0) {
    const clinicUpload = await uploadService.uploadMedia(
      UploadMediaKind.CLINIC_PHOTO,
      data.clinicPictureFiles
    );

    if (!isSuccessResponse(clinicUpload)) {
      return { error: clinicUpload.error };
    }

    uploadedMedia.push(...toUpdateProfileMedia(getUploadedMediaItems(clinicUpload.data)));
  }

  onStepChange("logo");

  if (!data.logoFile) {
    return { error: "Logo is required" };
  }

  const logoUpload = await uploadService.uploadMedia(
    UploadMediaKind.LOGO,
    data.logoFile
  );

  if (!isSuccessResponse(logoUpload)) {
    return { error: logoUpload.error };
  }

  uploadedMedia.push(...toUpdateProfileMedia(getUploadedMediaItems(logoUpload.data)));

  onStepChange("saving");

  const profileUpdate = await profileService.updateProfile(
    buildUpdateProfileRequest(data, { media: uploadedMedia })
  );

  if (!isSuccessResponse(profileUpdate)) {
    return { error: profileUpdate.error };
  }

  const baseUser = getUser();
  if (!baseUser) {
    return { error: "Session expired. Please sign in again." };
  }

  const refreshed = await refreshAuthUserFromProfile(dispatch, baseUser);
  if (!refreshed.user) {
    return { error: refreshed.error ?? "Failed to refresh profile" };
  }

  onStepChange("done");
  return { user: refreshed.user };
}
