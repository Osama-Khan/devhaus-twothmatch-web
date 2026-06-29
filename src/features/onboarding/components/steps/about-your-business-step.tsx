"use client";

import { useRef } from "react";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { CLINIC_TYPE_OPTIONS } from "@/features/onboarding/constants";
import { OnboardingSelectOption } from "@/features/onboarding/components/onboarding-select-option";
import { OnboardingUploadZone } from "@/features/onboarding/components/onboarding-upload-zone";
import { getClinicNameError } from "@/features/onboarding/form/onboarding-step-schemas";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";

/** Step 1 — clinic name, type, media uploads, and logo */
export function AboutYourBusinessStep({
  data,
  onChange,
  showValidation = false,
}: OnboardingStepProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const clinicNameError = getClinicNameError(data.clinicName);
  const logoError =
    showValidation && data.logoFileName === "Choose File"
      ? "Logo is required"
      : null;

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onChange("logoFileName", file?.name ?? "Choose File");
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

      <section className="flex flex-col gap-4">
        <FieldLabel>
          Type of Clinic
        </FieldLabel>
        <div
          role="radiogroup"
          aria-label="Type of Clinic"
          className="flex flex-col gap-3"
        >
          {CLINIC_TYPE_OPTIONS.map((option) => (
            <OnboardingSelectOption
              key={option.value}
              label={option.label}
              selected={data.clinicType === option.value}
              onSelect={() => onChange("clinicType", option.value)}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-foreground">Upload Media</h2>
        <OnboardingUploadZone
          icon={UserAdd01Icon}
          title="Add Pictures of Clinic"
          description="Max file size 10MB (.jpeg or .png only)"
          onFilesSelected={(files) =>
            onChange("clinicPictureCount", files.length)
          }
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
            {data.logoFileName}
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
