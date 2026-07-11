"use client";

import { ConfigIdSelect } from "@/features/jobs/components/config-id-select";
import {
  BooleanSwitchField,
  NumberInputField,
  RateIntervalToggle,
} from "@/features/jobs/components/job-form-fields";
import { ConfigType } from "@/features/config/types/config-type";
import { getLocumStep2FieldError } from "@/features/jobs/form/locum-job-step-schemas";
import type { LocumJobStepProps } from "@/features/jobs/types/locum-job-form";

/** Step 2 — rate interval, amount, overtime, payment, and cancellation */
export function LocumRatePaymentStep({
  data,
  onChange,
  showValidation = false,
}: LocumJobStepProps) {
  const rateIntervalError = showValidation
    ? getLocumStep2FieldError(data, "rateInterval")
    : null;
  const rateError = showValidation
    ? getLocumStep2FieldError(data, "rate")
    : null;
  const paymentError = showValidation
    ? getLocumStep2FieldError(data, "paymentTermsId")
    : null;
  const cancellationError = showValidation
    ? getLocumStep2FieldError(data, "cancellationPolicyId")
    : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Rate & Payment
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose how this shift is paid and set payment policies.
        </p>
      </div>

      <RateIntervalToggle
        value={data.rateInterval}
        onChange={(value) => onChange("rateInterval", value)}
        error={rateIntervalError}
      />

      <NumberInputField
        id="locum-rate"
        label="Rate"
        value={data.rate}
        required
        min={0}
        step="0.01"
        placeholder="0.00"
        suffix={data.rateInterval === "hour" ? "£/hr" : "£"}
        error={rateError}
        onChange={(value) => onChange("rate", value)}
      />

      <BooleanSwitchField
        id="locum-overtime-paid"
        label="Paid Overtime"
        checked={data.isOvertimePaid}
        onCheckedChange={(checked) => onChange("isOvertimePaid", checked)}
      />

      <ConfigIdSelect
        id="locum-payment-terms"
        label="Payment terms"
        configType={ConfigType.PAYMENT_TERMS}
        value={data.paymentTermsId}
        onValueChange={(value) => onChange("paymentTermsId", value)}
        required
        error={paymentError}
      />

      <ConfigIdSelect
        id="locum-cancellation"
        label="Cancellation policy"
        configType={ConfigType.CANCELLATION_POLICIES}
        value={data.cancellationPolicyId}
        onValueChange={(value) => onChange("cancellationPolicyId", value)}
        required
        error={cancellationError}
      />
    </div>
  );
}
