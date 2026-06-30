/** Total steps in the active profile onboarding flow */
export const ONBOARDING_TOTAL_STEPS = 4;

/** Maximum clinic photos allowed during onboarding */
export const MAX_CLINIC_PICTURES = 5;

export const PARKING_OPTIONS = [
  "On-site parking",
  "Street parking",
  "Nearby car park",
  "No parking",
] as const;

export const DOCUMENTS_REQUIRED_OPTIONS = [
  "GDC certificate",
  "DBS check",
  "Indemnity insurance",
  "Right to work",
] as const;

export const YEARS_OF_EXPERIENCE_OPTIONS = [
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5+ years",
] as const;

export const SKILLS_SOFTWARE_OPTIONS = [
  "Dentrix",
  "SOE Exact",
  "R4",
  "Excel / Microsoft Office",
] as const;

export const BENEFITS_OFFERED_OPTIONS = [
  "Pension scheme",
  "CPD allowance",
  "Flexible hours",
  "Free parking",
  "Health insurance",
] as const;

export const WORKLOAD_STYLE_OPTIONS = [
  "Fast-paced",
  "Steady / balanced",
  "Relaxed",
  "Mixed",
] as const;
