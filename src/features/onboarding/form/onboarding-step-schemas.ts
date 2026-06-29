import { z } from "zod";
import { hasCoordinates } from "@/features/location/utils/has-coordinates";

function normalizeGbPhoneNumber(phone: string): string {
  return phone.replace(/[\s()-]/g, "");
}

function isValidGbPhoneNumberValue(value: string): boolean {
  const normalized = normalizeGbPhoneNumber(value.trim());
  if (!normalized) {
    return false;
  }

  if (normalized.startsWith("+44")) {
    const nationalNumber = normalized.slice(3);
    return /^[1-9]\d{8,9}$/.test(nationalNumber);
  }

  if (normalized.startsWith("0")) {
    return /^0[1-9]\d{8,9}$/.test(normalized);
  }

  return false;
}

/**
 * Matches a web address with an optional `http(s)://` scheme and optional
 * trailing path/query.
 */
const websitePattern =
  /^(https?:\/\/)?([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(\/[^\s]*)?$/i;

/** Required clinic website link, normalized to include an `https://` scheme */
export const clinicWebsiteSchema = z
  .string()
  .trim()
  .lowercase()
  .regex(websitePattern, {
    error: "Please enter a valid website URL",
  })
  .transform((value) =>
    /^https?:\/\//i.test(value) ? value : `https://${value}`
  );

const gbPhoneFormatSchema = z
  .string()
  .trim()
  .refine(isValidGbPhoneNumberValue, "Enter a valid UK phone number");

/** Required UK phone number */
export const gbPhoneNumberSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .pipe(gbPhoneFormatSchema);

/** Required address with resolved map coordinates */
export const onboardingAddressSchema = z
  .object({
    address: z.string().trim().min(1, "Address is required"),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
  })
  .refine(hasCoordinates, {
    message: "Select an address from suggestions or detect your location",
    path: ["address"],
  });

/** Step 1 required fields */
export const onboardingStep1Schema = z.object({
  clinicName: z.string().trim().min(1, "Clinic name is required"),
  clinicType: z.enum(["private", "nhs", "mixed"]),
  logoFileName: z
    .string()
    .trim()
    .refine((value) => value.length > 0 && value !== "Choose File", {
      message: "Logo is required",
    }),
});

/** Step 2 required fields */
export const onboardingStep2Schema = z.object({
  clinicWebsite: clinicWebsiteSchema,
  phoneNumber: gbPhoneNumberSchema,
});

function firstZodErrorMessage(
  result: z.ZodSafeParseResult<unknown>
): string | null {
  if (result.success) {
    return null;
  }

  return result.error.issues[0]?.message ?? null;
}

/** Inline clinic name error — shown only after the user starts typing */
export function getClinicNameError(value: string): string | null {
  if (!value.trim()) {
    return null;
  }

  return firstZodErrorMessage(
    z.string().trim().min(1, "Clinic name is required").safeParse(value)
  );
}

/** Inline website error — shown only after the user starts typing */
export function getClinicWebsiteError(value: string): string | null {
  if (!value.trim()) {
    return null;
  }

  return firstZodErrorMessage(clinicWebsiteSchema.safeParse(value));
}

/** Inline phone error — shown only after the user starts typing */
export function getPhoneNumberError(value: string): string | null {
  if (!value.trim()) {
    return null;
  }

  return firstZodErrorMessage(gbPhoneFormatSchema.safeParse(value));
}

/** Inline address error — shown only after the user starts typing */
export function getAddressError(data: {
  address: string;
  latitude: number | null;
  longitude: number | null;
}): string | null {
  if (!data.address.trim()) {
    return null;
  }

  return firstZodErrorMessage(onboardingAddressSchema.safeParse(data));
}
