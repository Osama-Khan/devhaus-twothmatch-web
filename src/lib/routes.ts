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
  notifications: {
    _self: { path: "/notifications", label: "Notifications" },
  },
  settings: {
    _self: { path: "/settings", label: "Settings" },
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
    _self: { path: "/profile" },
  },
  upload: {
    _self: { path: "/upload" },
  },
  config: {
    byType: { _self: { path: "/config" } },
  },
  settings: {
    byType: { _self: { path: "/settings" } },
  },
  notifications: {
    _self: { path: "/notifications" },
    history: { _self: { path: "/notifications/history" } },
    unreadCount: { _self: { path: "/notifications/unread-count" } },
    markAllRead: { _self: { path: "/notifications/markAllRead" } },
    preferences: { _self: { path: "/notifications/preferences" } },
  },
  feed: {
    candidates: {
      locum: { _self: { path: "/feed/candidates/locum" } },
      permanent: { _self: { path: "/feed/candidates/permanent" } },
    },
  },
  candidates: {
    _self: { path: "/candidates/[id]", label: "Candidates" },
  },
  jobs: {
    _self: { path: "/jobs" },
  },
} as const;

/** Build a full API path including the configured root prefix (e.g. `/v2/profile`) */
export function apiPath(segment: string): string {
  const root = appEnv.apiRoot.replace(/\/$/, "");
  const path = segment.startsWith("/") ? segment : `/${segment}`;
  return `${root}${path}`;
}
