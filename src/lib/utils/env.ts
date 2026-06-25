/**
 * Typed environment access. Import `appEnv` everywhere instead of reading `process.env` directly.
 * Only `NEXT_PUBLIC_*` vars are available on the client; server-only vars are marked accordingly.
 */

const required = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

/** Public env vars safe to use on client and server */
export const appEnv = {
  /** Base URL of the external backend host (no trailing slash) */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",

  /** API root prefix on the backend (e.g. `/api`) */
  apiRoot: process.env.NEXT_PUBLIC_API_ROOT ?? "/api",

  /** Public site URL used for metadata and absolute links */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /** Application display name */
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "TwothMatch",

  /** Privacy policy URL */
  privacyPolicyUrl:
    process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL ??
    "https://www.twothmatch.co.uk/privacy-policy",

  /** Terms and conditions URL */
  termsAndConditionsUrl:
    process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL ??
    "https://www.twothmatch.co.uk/terms-and-conditions",
} as const;

/**
 * Server-only env vars. Do not import this module from client components.
 * Currently minimal — expand when cookie-based SSR auth is added.
 */
export const serverEnv = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

/** Keys validated at build time by `scripts/validate-env.js` */
export const requiredEnvKeys = [
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_SITE_URL",
] as const;

/** Validate required env vars — called from build script only */
export function validateEnv(): void {
  for (const key of requiredEnvKeys) {
    required(key, process.env[key]);
  }
}
