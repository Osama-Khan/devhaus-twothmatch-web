"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { OnboardingSelectField } from "@/features/onboarding/components/onboarding-select-field";
import { PARKING_OPTIONS } from "@/features/onboarding/constants";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";

/** Step 3 — location details and branch manager contact */
export function LocationBranchesStep({
  data,
  onChange,
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Location &amp; Branches
        </h1>

        <Field>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Input
            id="address"
            type="text"
            placeholder="Enter"
            value={data.address}
            onChange={(event) => onChange("address", event.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="locationPhone">Phone</FieldLabel>
          <Input
            id="locationPhone"
            type="tel"
            placeholder="Enter"
            value={data.locationPhone}
            onChange={(event) => onChange("locationPhone", event.target.value)}
          />
        </Field>

        <OnboardingSelectField
          id="parking"
          label="Parking"
          options={PARKING_OPTIONS}
          value={data.parking}
          onValueChange={(value) => onChange("parking", value)}
        />

        <Field>
          <FieldLabel htmlFor="publicTransport">Public Transport</FieldLabel>
          <Input
            id="publicTransport"
            type="text"
            placeholder="Enter"
            value={data.publicTransport}
            onChange={(event) => onChange("publicTransport", event.target.value)}
          />
        </Field>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-foreground">
          Assign Branch Manager
        </h2>

        <Field>
          <FieldLabel htmlFor="branchManagerContact">
            Contact Number
          </FieldLabel>
          <Input
            id="branchManagerContact"
            type="tel"
            placeholder="Enter"
            value={data.branchManagerContact}
            onChange={(event) =>
              onChange("branchManagerContact", event.target.value)
            }
          />
        </Field>
      </section>
    </div>
  );
}
