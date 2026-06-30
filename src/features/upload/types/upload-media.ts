import type { ProfileMedia } from "@/features/profile/types/profile-shared";

/** Allowed `kind` values for POST `/upload` (role-restricted on the server) */
export enum UploadMediaKind {
  /** Clinic related photos */
  CLINIC_PHOTO = "clinic_photo",
  /** Cover photo for clinic or candidate */
  COVER_PHOTO = "cover_photo",
  /** Clinic logo */
  LOGO = "logo",
  /** Video introduction for candidate */
  VIDEO_INTRO = "video_intro",
  /** Chat attachment for clinic or candidate */
  CHAT_ATTACHMENT = "chat_attachment",
  /** Profile photo for candidate */
  PROFILE_PHOTO = "profile_photo",
}

/** Response from POST `/upload` — single or multiple media rows */
export type UploadMediaResponse = {
  media: ProfileMedia | ProfileMedia[];
};

/** Normalizes upload response media to an array */
export function getUploadedMediaItems(
  response: UploadMediaResponse
): ProfileMedia[] {
  return Array.isArray(response.media) ? response.media : [response.media];
}
