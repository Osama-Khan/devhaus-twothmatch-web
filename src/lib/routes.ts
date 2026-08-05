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
  chat: {
    _self: { path: "/chat", label: "Chat" },
  },
  settings: {
    _self: { path: "/settings", label: "Settings" },
  },
  onboarding: {
    _self: { path: "/onboarding", label: "Onboarding" },
    verifying: { _self: { path: "/verifying", label: "Verifying" } },
    candidatesComingSoon: {
      _self: {
        path: "/candidates-coming-soon",
        label: "Candidates Coming Soon",
      },
    },
  },

  /** Authenticated app header navigation */
  nav: {
    home: { _self: { path: "/", label: "Home" } },
    matches: { _self: { path: "/matches", label: "Matches" } },
    myJobs: {
      _self: { path: "/my-jobs", label: "My Jobs" },
      create: {
        _self: { path: "/my-jobs/create", label: "Create Job" },
        byType: {
          _self: { path: "/my-jobs/create/[type]", label: "Create Job" },
        },
      },
    },
    invitations: {
      _self: { path: "/invitations", label: "Invitations" },
    },
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
    byId: { _self: { path: "/jobs/[id]" } },
  },
  ai: {
    jobs: {
      generateJd: { _self: { path: "/ai/jobs/generate-jd" } },
      refineJd: { _self: { path: "/ai/jobs/refine-jd" } },
    },
    profile: {
      generateAbout: { _self: { path: "/ai/profile/generate-about" } },
      refineAbout: { _self: { path: "/ai/profile/refine-about" } },
    },
  },
  events: {
    _self: { path: "/events" },
    bookings: { _self: { path: "/events/bookings" } },
    book: { _self: { path: "/events/book/[eventId]", label: "Book Event" } },
  },
  matches: {
    _self: { path: "/matches" },
    likes: { _self: { path: "/matches/likes" } },
  },
  interviews: {
    _self: { path: "/interviews" },
    byId: {
      _self: { path: "/interviews/[id]", label: "Interview" },
    },
    accept: {
      _self: { path: "/interviews/[id]/accept", label: "Accept Interview" },
    },
    complete: {
      _self: {
        path: "/interviews/[id]/complete",
        label: "Complete Interview",
      },
    },
    reschedule: {
      _self: {
        path: "/interviews/[id]/reschedule",
        label: "Reschedule Interview",
      },
    },
  },
  chat: {
    _self: { path: "/chat" },
    history: { _self: { path: "/chat/history" } },
    send: { _self: { path: "/chat/send" } },
    sendFile: { _self: { path: "/chat/send-file" } },
    markRead: {
      _self: {
        path: "/chat/threads/[threadId]/read",
        label: "Mark Thread Read",
      },
    },
  },
  payments: {
    publishableKey: { _self: { path: "/payments/publishable-key" } },
    plans: { _self: { path: "/payments/plans" } },
    me: {
      subscription: { _self: { path: "/payments/me/subscription" } },
      entitlement: { _self: { path: "/payments/me/entitlement" } },
      paymentMethods: { _self: { path: "/payments/me/payment-methods" } },
      invoices: { _self: { path: "/payments/me/invoices" } },
      invoiceById: {
        _self: {
          path: "/payments/me/invoices/[invoiceId]",
          label: "Payment Invoice",
        },
      },
    },
    setupIntent: { _self: { path: "/payments/setup-intent" } },
    paymentMethodDefault: {
      _self: {
        path: "/payments/payment-methods/[stripePaymentMethodId]/default",
        label: "Set Default Payment Method",
      },
    },
    paymentMethodById: {
      _self: {
        path: "/payments/payment-methods/[stripePaymentMethodId]",
        label: "Payment Method",
      },
    },
    subscriptions: { _self: { path: "/payments/subscriptions" } },
    checkout: { _self: { path: "/payments/checkout" } },
    billingPortal: { _self: { path: "/payments/billing-portal" } },
    changeSubscription: { _self: { path: "/payments/subscriptions/change" } },
    cancelSubscription: { _self: { path: "/payments/subscriptions/cancel" } },
    resumeSubscription: { _self: { path: "/payments/subscriptions/resume" } },
  },
} as const;

/** Build a full API path including the configured root prefix (e.g. `/v2/profile`) */
export function apiPath(segment: string): string {
  const root = appEnv.apiRoot.replace(/\/$/, "");
  const path = segment.startsWith("/") ? segment : `/${segment}`;
  return `${root}${path}`;
}
