/** User role on the platform */
export type UserRole = "candidate" | "practice";

/**
 * Core user fields returned from auth endpoints (`/auth/login`, etc.).
 */
export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};

/**
 * Application-facing user stored in Redux and localStorage.
 * Enriched after login or `/profile/me` hydration.
 */
export type User = AuthUser & {
  fullName?: string;
  avatarUrl?: string;
  isProfileComplete?: boolean;
  isProfileVerified?: boolean;
  completionPercent?: number;
  /** Discriminator from GET `/profile/me` */
  profileKind?: "candidate" | "practice";
};

/** POST `/auth/login` — 200 OK */
export type LoginResponse = {
  token: string;
  user: AuthUser;
  isProfileComplete: boolean;
  isProfileVerified: boolean;
  completionPercent: number;
};

/** POST `/auth/signup` — 201 Created (no JWT until email verified) */
export type SignupResponse = {
  id: string;
  email: string;
  role: UserRole;
  emailSendFailed: boolean;
};

/** GET `/profile/me` — unified profile for candidate or practice */
export type ProfileMeResponse = {
  kind: "candidate" | "practice";
  profile: {
    id: string;
    fullName?: string;
    jobTitle?: string;
    clinicType?: string;
    avatar?: string;
  };
  completionPercent: number;
  completionSections?: unknown[];
  jobPreferences?: unknown;
  locations?: unknown[];
};

/** Session persisted client-side after login */
export type AuthSession = {
  token: string;
  user: User;
};
