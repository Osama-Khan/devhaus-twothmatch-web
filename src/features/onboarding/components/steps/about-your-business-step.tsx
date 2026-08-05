"use client";

import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { ClinicTypeSelect } from "@/features/onboarding/components/clinic-type-select";
import { ClinicPictureAlbum } from "@/features/onboarding/components/clinic-picture-album";
import { MAX_CLINIC_PICTURES } from "@/features/onboarding/constants";
import { appendClinicPictureFiles } from "@/features/onboarding/utils/clinic-picture-files";
import { getClinicNameError } from "@/features/onboarding/form/onboarding-step-schemas";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";
import { toast } from "sonner";

/** Step 1 — clinic name, type, media uploads, and logo */
export function AboutYourBusinessStep({
  data,
  onChange,
  showValidation = false,
}: OnboardingStepProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const clinicNameError = getClinicNameError(data.clinicName);
  const hasLogo =
    Boolean(data.logoUrl) || data.logoFileName !== "Choose File";
  const logoError =
    showValidation && !hasLogo ? "Logo is required" : null;

  const handleClinicTypeSelect = useCallback(
    ({ id, name }: { id: string; name: string }) => {
      onChange("clinicType", id);
      onChange("clinicTypeName", name);
    },
    [onChange]
  );

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange("logoFile", file ?? null);
    onChange("logoFileName", file?.name ?? "Choose File");
    if (file) {
      onChange("logoUrl", null);
    }
  };

  const handleClinicPicturesSelected = (files: FileList) => {
    const { files: nextFiles, skippedCount } = appendClinicPictureFiles(
      data.clinicPictureFiles,
      Array.from(files),
      MAX_CLINIC_PICTURES - data.clinicPictureUrls.length
    );

    if (skippedCount > 0) {
      toast.error("You've reached the maximum number of clinic images.");
    }

    onChange("clinicPictureFiles", nextFiles);
    onChange(
      "clinicPictureCount",
      data.clinicPictureUrls.length + nextFiles.length
    );
  };

  const handleRemoveClinicPicture = (index: number) => {
    const nextFiles = data.clinicPictureFiles.filter(
      (_, fileIndex) => fileIndex !== index
    );
    onChange("clinicPictureFiles", nextFiles);
    onChange(
      "clinicPictureCount",
      data.clinicPictureUrls.length + nextFiles.length
    );
  };

  const handleRemovePersistedUrl = (index: number) => {
    const nextUrls = data.clinicPictureUrls.filter(
      (_, urlIndex) => urlIndex !== index
    );
    onChange("clinicPictureUrls", nextUrls);
    onChange(
      "clinicPictureCount",
      nextUrls.length + data.clinicPictureFiles.length
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        About Your Business
      </h1>

      <Field data-invalid={Boolean(clinicNameError)}>
        <RequiredFieldLabel htmlFor="clinicName">Clinic Name</RequiredFieldLabel>
        <Input
          id="clinicName"
          type="text"
          placeholder="Enter"
          aria-invalid={Boolean(clinicNameError)}
          value={data.clinicName}
          onChange={(event) => onChange("clinicName", event.target.value)}
        />
        <FieldError>{clinicNameError}</FieldError>
      </Field>

      <ClinicTypeSelect
        value={data.clinicType}
        onSelect={handleClinicTypeSelect}
        showValidation={showValidation}
      />

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Upload Media</h2>
        <ClinicPictureAlbum
          files={data.clinicPictureFiles}
          persistedUrls={data.clinicPictureUrls}
          onFilesSelected={handleClinicPicturesSelected}
          onRemove={handleRemoveClinicPicture}
          onRemovePersistedUrl={handleRemovePersistedUrl}
        />
      </section>

      <section className="flex flex-col gap-3">
        <RequiredFieldLabel htmlFor="logo-upload">Upload Logo</RequiredFieldLabel>
        <input
          id="logo-upload"
          ref={logoInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="sr-only"
          onChange={handleLogoChange}
        />
        <InputGroup className="flex flex-row items-center justify-between">
          <InputGroupAddon className="text-foreground">
            {data.logoUrl && data.logoFileName === "Choose File"
              ? "Logo uploaded"
              : data.logoFileName}
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={() => logoInputRef.current?.click()}
            >
              Browse
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <FieldError>{logoError}</FieldError>
      </section>
    </div>
  );
}
