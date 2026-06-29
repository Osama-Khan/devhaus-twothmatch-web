"use client";

import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ProfilePreviewCard } from "@/features/onboarding/components/profile-preview-card";
import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";
import { buildProfilePreview } from "@/features/onboarding/utils/build-profile-preview";
import { useAuthSelector } from "@/lib/store/hooks";

type ProfilePreviewPublishStepProps = {
  data: OnboardingFormData;
  onAddPhotos: () => void;
};

/** Step 4 — live preview of saved onboarding data before publish */
export function ProfilePreviewPublishStep({
  data,
  onAddPhotos,
}: ProfilePreviewPublishStepProps) {
  const { user } = useAuthSelector();
  const practiceName =
    data.clinicName.trim() ||
    user?.fullName ||
    user?.email ||
    "Your Practice";

  const preview = useMemo(
    () => buildProfilePreview(data, practiceName),
    [data, practiceName]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile Preview &amp; Publish
        </h1>
        <p className="text-sm text-muted-foreground">
          Live preview of what candidates will see
        </p>
      </div>

      <ProfilePreviewCard preview={preview} />

      <p className="text-center text-sm text-muted-foreground">
        Adding more photos increases applicant rate by 37%
      </p>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={onAddPhotos}
      >
        <span className="flex size-5 items-center justify-center rounded-full border border-primary text-primary">
          <HugeiconsIcon icon={Add01Icon} className="size-3" strokeWidth={2} />
        </span>
        Add More Photos
      </Button>
    </div>
  );
}
