"use client";

import { Field, FieldError, FieldLabel, RequiredFieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { OnboardingSelectField } from "@/features/onboarding/components/onboarding-select-field";
import { PARKING_OPTIONS } from "@/features/onboarding/constants";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";
import { AddressLocationField } from "@/features/location/components/address-location-field";
import { getPostcodeError } from "@/features/onboarding/form/onboarding-step-schemas";

/** Step 3 — location details and branch manager contact */
export function LocationBranchesStep({
  data,
  onChange,
}: OnboardingStepProps) {
  const postcodeError = getPostcodeError(data.postcode);
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Location &amp; Branches
        </h1>

        <AddressLocationField
          value={{
            address: data.address,
            addressPlaceId: data.addressPlaceId,
            latitude: data.latitude,
            longitude: data.longitude,
          }}
          onChange={(value) => {
            onChange("address", value.address);
            onChange("addressPlaceId", value.addressPlaceId);
            onChange("latitude", value.latitude);
            onChange("longitude", value.longitude);
          }}
        />

        <Field data-invalid={Boolean(postcodeError)}>
          <RequiredFieldLabel htmlFor="postcode">Postcode</RequiredFieldLabel>
          <Input
            id="postcode"
            type="text"
            placeholder="Enter"
            autoComplete="postal-code"
            aria-invalid={Boolean(postcodeError)}
            value={data.postcode}
            onChange={(event) => onChange("postcode", event.target.value)}
          />
          <FieldError>{postcodeError}</FieldError>
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
          <FieldLabel htmlFor="branchManagerName">Name</FieldLabel>
          <Input
            id="branchManagerName"
            type="text"
            placeholder="Enter"
            autoComplete="name"
            value={data.branchManagerName}
            onChange={(event) =>
              onChange("branchManagerName", event.target.value)
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="branchManagerContact">Phone</FieldLabel>
          <Input
            id="branchManagerContact"
            type="tel"
            placeholder="Enter"
            autoComplete="tel"
            value={data.branchManagerContact}
            onChange={(event) =>
              onChange("branchManagerContact", event.target.value)
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="branchManagerEmail">Email</FieldLabel>
          <Input
            id="branchManagerEmail"
            type="email"
            placeholder="Enter"
            autoComplete="email"
            value={data.branchManagerEmail}
            onChange={(event) =>
              onChange("branchManagerEmail", event.target.value)
            }
          />
        </Field>
      </section>
    </div>
  );
}
