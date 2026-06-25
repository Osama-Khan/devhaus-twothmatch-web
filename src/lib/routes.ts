import { appEnv } from "@/lib/utils/env";

/**
 * Centralized route map for app navigation and external API paths.
 * Use these constants instead of hardcoded path strings.
 */

/** App-facing page routes */
export const appRoutes = {
  home: {
    _self: { path: "/", label: "Home" },
  },
  auth: {
    _self: { path: "/auth", label: "Auth" },
    login: { _self: { path: "/auth/login", label: "Login" } },
    register: { _self: { path: "/auth/register", label: "Register" } },
    verifyEmail: {
      _self: { path: "/auth/verify-email", label: "Verify email" },
    },
    forgotPassword: {
      _self: { path: "/auth/forgot-password", label: "Forgot password" },
    },
    resetPassword: {
      _self: { path: "/auth/reset-password", label: "Reset password" },
    },
  },
  profile: {
    _self: { path: "/profile", label: "Profile" },
  },
  onboarding: {
    _self: { path: "/onboarding", label: "Onboarding" },
    verifying: { _self: { path: "/verifying", label: "Verifying" } },
  },
  /** Authenticated app header navigation */
  nav: {
    home: { _self: { path: "/", label: "Home" } },
    matches: { _self: { path: "/matches", label: "Matches" } },
    myJobs: { _self: { path: "/my-jobs", label: "My Jobs" } },
    invites: { _self: { path: "/invites", label: "Invites" } },
    events: { _self: { path: "/events", label: "Events" } },
  },
  docs: {
    _self: { path: "/privacy", label: "Privacy" },
    privacy: { _self: { path: "/privacy", label: "Privacy Policy" } },
    terms: { _self: { path: "/terms", label: "Terms & Conditions" } },
  },
} as const;

/**
 * Path segments on the external backend API (after `apiRoot`).
 * Full URL: `{NEXT_PUBLIC_API_URL}{NEXT_PUBLIC_API_ROOT}{path}`
 */
export const externalApiRoutes = {
  auth: {
    login: { _self: { path: "/auth/login" } },
    signup: { _self: { path: "/auth/signup" } },
    logout: { _self: { path: "/auth/logout" } },
    verifyEmail: { _self: { path: "/auth/verify-email" } },
    resendOtp: { _self: { path: "/auth/resend-otp" } },
    forgotPassword: { _self: { path: "/auth/forgot-password" } },
    resetPassword: { _self: { path: "/auth/reset-password" } },
    updateFcmToken: { _self: { path: "/auth/update-fcm-token" } },
    google: { _self: { path: "/auth/google" } },
    apple: { _self: { path: "/auth/apple" } },
  },
  profile: {
    me: { _self: { path: "/profile/me" } },
  },
  config: {
    public: { _self: { path: "/config/public" } },
  },
} as const;

/** Build a full API path including the configured root prefix (e.g. `/api/auth/login`) */
export function apiPath(segment: string): string {
  const root = appEnv.apiRoot.replace(/\/$/, "");
  const path = segment.startsWith("/") ? segment : `/${segment}`;
  return `${root}${path}`;
}
