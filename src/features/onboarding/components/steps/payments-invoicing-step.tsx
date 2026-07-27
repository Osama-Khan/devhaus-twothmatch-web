"use client";

import { useCallback } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ConfigIdSelect } from "@/features/jobs/components/config-id-select";
import { useConfigByType } from "@/features/config/hooks/use-config-by-type";
import { ConfigType } from "@/features/config/types/config-type";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";

/** Step 5 — billing notes and cancellation policy */
export function PaymentsInvoicingStep({
  data,
  onChange,
  showValidation = false,
}: OnboardingStepProps) {
  const { items: policyOptions } = useConfigByType(
    ConfigType.CANCELLATION_POLICIES
  );

  const handlePolicyChange = useCallback(
    (id: string) => {
      const selected = policyOptions.find((item) => item.id === id);
      onChange("cancellationPolicyId", id);
      onChange("cancellationPolicyName", selected?.name ?? "");
    },
    [onChange, policyOptions]
  );

  const cancellationError =
    showValidation && data.cancellationPolicyId.trim().length === 0
      ? "Cancellation policy is required"
      : null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Payments &amp; Invoicing Setup
      </h1>

      <div className="flex flex-col gap-5">
        <Field>
          <FieldLabel htmlFor="stripeBankDetails">
            Connect Stripe / Bank Details
          </FieldLabel>
          <Input
            id="stripeBankDetails"
            type="text"
            placeholder="Enter"
            value={data.stripeBankDetails}
            onChange={(event) =>
              onChange("stripeBankDetails", event.target.value)
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="invoiceEmailBilling">
            Invoice Email &amp; Billing Address
          </FieldLabel>
          <Input
            id="invoiceEmailBilling"
            type="text"
            placeholder="Enter"
            value={data.invoiceEmailBilling}
            onChange={(event) =>
              onChange("invoiceEmailBilling", event.target.value)
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="defaultLocumRates">
            Default Locum Rates per Role
          </FieldLabel>
          <Input
            id="defaultLocumRates"
            type="text"
            placeholder="Enter"
            value={data.defaultLocumRates}
            onChange={(event) =>
              onChange("defaultLocumRates", event.target.value)
            }
          />
        </Field>

        <ConfigIdSelect
          id="cancellationPolicy"
          label="Cancellation Policy"
          configType={ConfigType.CANCELLATION_POLICIES}
          value={data.cancellationPolicyId}
          onValueChange={handlePolicyChange}
          required
          error={cancellationError}
        />
      </div>
    </div>
  );
}
