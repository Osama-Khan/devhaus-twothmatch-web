import { buildOnboardingStepRequest } from "@/features/onboarding/utils/build-update-profile-request";
import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";
import { profileService } from "@/features/profile/services/profile-service";
import type { UpdateProfileMedia } from "@/features/profile/types/update-profile-request";
import { uploadService } from "@/features/upload/services/upload-service";
import {
  getUploadedMediaItems,
  UploadMediaKind,
} from "@/features/upload/types/upload-media";
import { isSuccessResponse } from "@/lib/types/response";

function toUpdateProfileMedia(
  items: ReturnType<typeof getUploadedMediaItems>
): UpdateProfileMedia[] {
  return items.map((item) => ({
    kind: item.kind,
    url: item.url,
  }));
}

export type SaveOnboardingStepResult = {
  error?: string;
  /** Form patches after uploads (persisted media URLs, cleared File fields) */
  formPatch?: Partial<OnboardingFormData>;
};

/**
 * Uploads any new media for the step, then PUTs that step's partial profile body.
 * Does not send `profileCompletion`.
 */
export async function saveOnboardingStep(
  step: number,
  data: OnboardingFormData
): Promise<SaveOnboardingStepResult> {
  const formPatch: Partial<OnboardingFormData> = {};
  let media: UpdateProfileMedia[] | undefined;

  if (step === 1) {
    const uploadedMedia: UpdateProfileMedia[] = [];

    if (data.clinicPictureFiles.length > 0) {
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

      const newUrls = newClinicMedia.map((item) => item.url);
      formPatch.clinicPictureUrls = [
        ...data.clinicPictureUrls,
        ...newUrls,
      ];
      formPatch.clinicPictureFiles = [];
      formPatch.clinicPictureCount =
        (formPatch.clinicPictureUrls?.length ?? 0);
    }

    if (data.logoFile) {
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

    // Include persisted URLs so media merge keeps prior photos when only logo changes
    const persistedClinic = (
      formPatch.clinicPictureUrls ?? data.clinicPictureUrls
    ).map((url) => ({
      kind: UploadMediaKind.CLINIC_PHOTO,
      url,
    }));
    const logoUrl = formPatch.logoUrl ?? data.logoUrl;
    const persistedLogo = logoUrl
      ? [{ kind: UploadMediaKind.LOGO, url: logoUrl }]
      : [];

    media = [...persistedClinic, ...persistedLogo, ...uploadedMedia];
    // Deduplicate by kind+url
    const seen = new Set<string>();
    media = media.filter((item) => {
      const key = `${item.kind}:${item.url}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    if (media.length === 0) {
      media = undefined;
    }
  }

  const body = buildOnboardingStepRequest(step, data, media);
  if (!body || Object.keys(body).length === 0) {
    return { formPatch: Object.keys(formPatch).length ? formPatch : undefined };
  }

  const response = await profileService.updateProfile(body);
  if (!isSuccessResponse(response)) {
    return { error: response.error };
  }

  return {
    formPatch: Object.keys(formPatch).length ? formPatch : undefined,
  };
}
