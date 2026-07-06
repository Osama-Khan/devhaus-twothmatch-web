import { MAX_CLINIC_PICTURES } from "@/features/onboarding/constants";

type AppendClinicPictureFilesResult = {
  files: File[];
  skippedCount: number;
};

/**
 * Appends selected clinic photos up to the onboarding limit.
 */
export function appendClinicPictureFiles(
  existing: File[],
  incoming: readonly File[],
  max = MAX_CLINIC_PICTURES
): AppendClinicPictureFilesResult {
  const remaining = max - existing.length;

  if (remaining <= 0) {
    return { files: existing, skippedCount: incoming.length };
  }

  const toAdd = incoming.slice(0, remaining);

  return {
    files: [...existing, ...toAdd],
    skippedCount: Math.max(0, incoming.length - remaining),
  };
}
