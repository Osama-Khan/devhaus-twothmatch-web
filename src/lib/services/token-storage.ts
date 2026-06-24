import { ACCESS_TOKEN_KEY, USER_SNAPSHOT_KEY } from "@/lib/constants/app";
import type { User } from "@/lib/types/entities";

/**
 * Client-side JWT and user snapshot persistence.
 * Tokens live in localStorage until cookie-based SSR auth is implemented.
 */

/** Read the stored access token, or null if absent */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/** Persist the access token */
export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/** Remove the access token */
export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/** Read cached user snapshot */
export function getUserSnapshot(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_SNAPSHOT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/** Cache user snapshot for faster initial render */
export function setUserSnapshot(user: User): void {
  localStorage.setItem(USER_SNAPSHOT_KEY, JSON.stringify(user));
}

/** Clear all auth-related storage */
export function clearAuthStorage(): void {
  clearAccessToken();
  localStorage.removeItem(USER_SNAPSHOT_KEY);
}

/** Whether a token exists in storage */
export function hasStoredToken(): boolean {
  return Boolean(getAccessToken());
}
