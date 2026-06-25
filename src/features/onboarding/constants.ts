/** Total steps in the profile onboarding flow */
export const ONBOARDING_TOTAL_STEPS = 7;

export type ClinicType = "private" | "nhs" | "mixed";

export const CLINIC_TYPE_OPTIONS: ReadonlyArray<{
  value: ClinicType;
  label: string;
}> = [
  { value: "private", label: "Private Clinic" },
  { value: "nhs", label: "NHS Clinic" },
  { value: "mixed", label: "Mixed Clinic" },
];
