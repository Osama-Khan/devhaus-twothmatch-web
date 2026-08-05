import { refreshAuthUserFromProfile } from "@/features/auth/utils/refresh-auth-user-from-profile";
import { syncAuthUser } from "@/features/auth/utils/refresh-auth-user-from-profile";
import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";
import type { OnboardingPublishStep } from "@/features/onboarding/types/onboarding-publish-step";
import {
  buildPersistedMedia,
  buildPublishProfileRequest,
} from "@/features/onboarding/utils/build-update-profile-request";
import { profileService } from "@/features/profile/services/profile-service";
import type { UpdateProfileMedia } from "@/features/profile/types/update-profile-request";
import { uploadService } from "@/features/upload/services/upload-service";
import {
  getUploadedMediaItems,
  UploadMediaKind,
} from "@/features/upload/types/upload-media";
import type { AppDispatch } from "@/lib/store";
import type { User } from "@/lib/types/entities";
import {
  getMissingFields,
  isPublishRequirementsNotMet,
  isSuccessResponse,
} from "@/lib/types/response";

function toUpdateProfileMedia(
  items: ReturnType<typeof getUploadedMediaItems>
): UpdateProfileMedia[] {
  return items.map((item) => ({
    kind: item.kind,
    url: item.url,
  }));
}

export type PublishOnboardingResult = {
  error?: string;
  user?: User;
  /** Present when publish minima failed; data may still be saved */
  missingFields?: string[];
  /** Form patches after any last-minute media uploads */
  formPatch?: Partial<OnboardingFormData>;
};

/**
 * Uploads any remaining media, completes onboarding with `profileCompletion: true`,
 * and refreshes auth state from the profile response.
 */
export async function publishOnboarding(
  data: OnboardingFormData,
  onStepChange: (step: OnboardingPublishStep) => void,
  dispatch: AppDispatch,
  getUser: () => User | null
): Promise<PublishOnboardingResult> {
  const formPatch: Partial<OnboardingFormData> = {};
  const uploadedMedia: UpdateProfileMedia[] = [...buildPersistedMedia(data)];

  const needsClinicUpload = data.clinicPictureFiles.length > 0;
  const needsLogoUpload = Boolean(data.logoFile);

  if (needsClinicUpload || needsLogoUpload) {
    onStepChange("clinic-images");

    if (needsClinicUpload) {
      const clinicUpload = await uploadService.uploadMedia(
        UploadMediaKind.CLINIC_PHOTO,
        data.clinicPictureFiles
      );

      if (!isSuccessResponse(clinicUpload)) {
        return { error: clinicUpload.error };
      }

      const newClinicMedia = toUpdateProfileMedia(
        getUploadedMediaItems(clinicUpload.data)
      );
      uploadedMedia.push(...newClinicMedia);
      formPatch.clinicPictureUrls = [
        ...data.clinicPictureUrls,
        ...newClinicMedia.map((item) => item.url),
      ];
      formPatch.clinicPictureFiles = [];
      formPatch.clinicPictureCount = formPatch.clinicPictureUrls.length;
    }

    onStepChange("logo");

    if (needsLogoUpload && data.logoFile) {
      const logoUpload = await uploadService.uploadMedia(
        UploadMediaKind.LOGO,
        data.logoFile
      );

      if (!isSuccessResponse(logoUpload)) {
        return { error: logoUpload.error };
      }

      const logoMedia = toUpdateProfileMedia(
        getUploadedMediaItems(logoUpload.data)
      );
      uploadedMedia.push(...logoMedia);
      const logoUrl = logoMedia[0]?.url ?? null;
      formPatch.logoUrl = logoUrl;
      formPatch.logoFile = null;
      formPatch.logoFileName = logoUrl ? "Logo uploaded" : "Choose File";
    }
  } else if (!data.logoUrl) {
    return { error: "Logo is required" };
  }

  onStepChange("saving");

  // Deduplicate media by kind+url
  const seen = new Set<string>();
  const media = uploadedMedia.filter((item) => {
    const key = `${item.kind}:${item.url}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  const profileUpdate = await profileService.updateProfile(
    buildPublishProfileRequest(data, media)
  );

  if (!isSuccessResponse(profileUpdate)) {
    if (isPublishRequirementsNotMet(profileUpdate)) {
      return {
        error: profileUpdate.error,
        missingFields: getMissingFields(profileUpdate),
        formPatch: Object.keys(formPatch).length ? formPatch : undefined,
      };
    }
    return { error: profileUpdate.error };
  }

  const baseUser = getUser();
  if (!baseUser) {
    return { error: "Session expired. Please sign in again." };
  }

  // Prefer PUT response flags, then refresh from GET for full merge
  const patchedUser: User = {
    ...baseUser,
    isProfileComplete:
      profileUpdate.data.profileCompletion ?? baseUser.isProfileComplete,
    completionPercent:
      profileUpdate.data.completionPercent ?? baseUser.completionPercent,
  };
  syncAuthUser(dispatch, patchedUser);

  const refreshed = await refreshAuthUserFromProfile(dispatch, patchedUser);
  if (!refreshed.user) {
    // PUT succeeded with completion — still treat as done if latch is true
    if (profileUpdate.data.profileCompletion === true) {
      onStepChange("done");
      return { user: patchedUser };
    }
    return { error: refreshed.error ?? "Failed to refresh profile" };
  }

  if (
    profileUpdate.data.profileCompletion === true &&
    !refreshed.user.isProfileComplete
  ) {
    // Trust the PUT latch if GET lag/mismatch
    const completedUser = {
      ...refreshed.user,
      isProfileComplete: true,
      completionPercent:
        profileUpdate.data.completionPercent ??
        refreshed.user.completionPercent,
    };
    syncAuthUser(dispatch, completedUser);
    onStepChange("done");
    return { user: completedUser };
  }

  if (!refreshed.user.isProfileComplete) {
    return {
      error: "Profile was saved but is not yet complete",
      user: refreshed.user,
    };
  }

  onStepChange("done");
  return { user: refreshed.user };
}
