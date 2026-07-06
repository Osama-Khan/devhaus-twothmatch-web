import { ACCESS_TOKEN_KEY } from "@/lib/constants/app";

/**
 * Client-side JWT persistence.
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

/** Clear all auth-related storage */
export function clearAuthStorage(): void {
  clearAccessToken();
}

/** Whether a token exists in storage */
export function hasStoredToken(): boolean {
  return Boolean(getAccessToken());
}
