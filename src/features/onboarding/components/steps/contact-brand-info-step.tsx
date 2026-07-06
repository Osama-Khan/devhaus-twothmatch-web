"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldLabel,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";
import {
  getClinicWebsiteError,
  getPhoneNumberError,
} from "@/features/onboarding/form/onboarding-step-schemas";

/** Step 2 — clinic website, social links, phone, and visibility */
export function ContactBrandInfoStep({ data, onChange }: OnboardingStepProps) {
  const clinicWebsiteError = getClinicWebsiteError(data.clinicWebsite);
  const phoneNumberError = getPhoneNumberError(data.phoneNumber);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Contact &amp; Brand Info
      </h1>

      <div className="flex flex-col gap-5">
        <Field data-invalid={Boolean(clinicWebsiteError)}>
          <RequiredFieldLabel htmlFor="clinicWebsite">
            Clinic Website Link
          </RequiredFieldLabel>
          <Input
            id="clinicWebsite"
            type="url"
            placeholder="Enter"
            aria-invalid={Boolean(clinicWebsiteError)}
            value={data.clinicWebsite}
            onChange={(event) => onChange("clinicWebsite", event.target.value)}
          />
          <FieldError>{clinicWebsiteError}</FieldError>
        </Field>

        <Field data-invalid={Boolean(phoneNumberError)}>
          <RequiredFieldLabel htmlFor="phoneNumber">
            Phone Number
          </RequiredFieldLabel>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter"
            aria-invalid={Boolean(phoneNumberError)}
            value={data.phoneNumber}
            onChange={(event) => onChange("phoneNumber", event.target.value)}
          />
          <FieldError>{phoneNumberError}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="instagram">Instagram</FieldLabel>
          <Input
            id="instagram"
            type="text"
            placeholder="Enter"
            value={data.instagram}
            onChange={(event) => onChange("instagram", event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="facebook">Facebook</FieldLabel>
          <Input
            id="facebook"
            type="text"
            placeholder="Enter"
            value={data.facebook}
            onChange={(event) => onChange("facebook", event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="linkedin">LinkedIn</FieldLabel>
          <Input
            id="linkedin"
            type="text"
            placeholder="Enter"
            value={data.linkedin}
            onChange={(event) => onChange("linkedin", event.target.value)}
          />
        </Field>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <Checkbox
            checked={data.hideFromPublic}
            onCheckedChange={(checked) =>
              onChange("hideFromPublic", Boolean(checked))
            }
          />
          Hide From Public
        </label>
      </div>
    </div>
  );
}
