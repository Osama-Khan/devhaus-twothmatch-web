"use client";

import type {
  UploadMediaKind,
  UploadMediaResponse,
} from "@/features/upload/types/upload-media";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";

function buildUploadFormData(
  kind: UploadMediaKind,
  files: readonly File[]
): FormData {
  const formData = new FormData();
  formData.append("kind", kind);

  for (const file of files) {
    formData.append("file", file);
  }

  return formData;
}

/**
 * Client-side upload service — authenticated multipart uploads to POST `/upload`.
 */
export const uploadService = {
  /**
   * Upload one or more files for a given media kind.
   * Repeat `file` fields are used when uploading multiple files (e.g. clinic photos).
   */
  uploadMedia(
    kind: UploadMediaKind,
    files: File | readonly File[]
  ): Promise<AppResponseType<UploadMediaResponse>> {
    const fileList = Array.isArray(files) ? files : [files];

    return apiFetcher.post<UploadMediaResponse>(
      externalApiRoutes.upload._self.path,
      buildUploadFormData(kind, fileList)
    );
  },
};
