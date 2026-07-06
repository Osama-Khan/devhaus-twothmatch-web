"use client";

import { apiFetcher } from "@/lib/services/api-fetcher";
import {
  clearAuthStorage,
  setAccessToken,
} from "@/lib/services/token-storage";
import { externalApiRoutes } from "@/lib/routes";
import type {
  LoginResponse,
  SignupResponse,
  User,
} from "@/lib/types/entities";
import type { AppResponseType } from "@/lib/types/response";
import type {
  ForgotPasswordFormData,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  VerifyEmailFormData,
} from "@/features/auth/form";
import { getWebDevicePayload } from "@/lib/utils/device";
import { userFromLogin } from "@/features/auth/utils/map-profile-response";

/**
 * Client-side auth service — calls the external backend API.
 * No server-side session logic lives in this app.
 */
export const authService = {
  /** POST `/auth/login` */
  login(credentials: LoginFormData): Promise<AppResponseType<LoginResponse>> {
    return apiFetcher.post<LoginResponse>(
      externalApiRoutes.auth.login._self.path,
      {
        email: credentials.email,
        password: credentials.password,
        ...getWebDevicePayload(),
      },
      { skipAuth: true }
    );
  },

  /** POST `/auth/signup` — returns account info, not a JWT */
  signup(data: RegisterFormData): Promise<AppResponseType<SignupResponse>> {
    const { confirmPassword: _, ...payload } = data;
    return apiFetcher.post<SignupResponse>(
      externalApiRoutes.auth.signup._self.path,
      payload,
      { skipAuth: true }
    );
  },

  /** POST `/auth/verify-email` */
  verifyEmail(
    data: VerifyEmailFormData
  ): Promise<AppResponseType<{ message: string }>> {
    return apiFetcher.post(
      externalApiRoutes.auth.verifyEmail._self.path,
      data,
      { skipAuth: true }
    );
  },

  /** POST `/auth/resend-otp` */
  resendOtp(email: string): Promise<AppResponseType<{ message: string }>> {
    return apiFetcher.post(
      externalApiRoutes.auth.resendOtp._self.path,
      { email },
      { skipAuth: true }
    );
  },

  /** POST `/auth/forgot-password` */
  forgotPassword(
    data: ForgotPasswordFormData
  ): Promise<AppResponseType<{ message: string; emailSendFailed?: boolean }>> {
    return apiFetcher.post(
      externalApiRoutes.auth.forgotPassword._self.path,
      data,
      { skipAuth: true }
    );
  },

  /** POST `/auth/reset-password` */
  resetPassword(
    data: ResetPasswordFormData
  ): Promise<AppResponseType<{ message: string }>> {
    const { confirmPassword: _, ...payload } = data;
    return apiFetcher.post(
      externalApiRoutes.auth.resetPassword._self.path,
      payload,
      { skipAuth: true }
    );
  },

  /** POST `/auth/logout` then clear local storage */
  async logout(): Promise<void> {
    await apiFetcher.post(externalApiRoutes.auth.logout._self.path, {});
    clearAuthStorage();
  },

  /** Persist JWT after login */
  persistAccessToken(token: string): void {
    setAccessToken(token);
  },

  /** Build Redux user from login response */
  mapLoginResponse(response: LoginResponse): { user: User; token: string } {
    return {
      token: response.token,
      user: userFromLogin(response.user, {
        isProfileComplete: response.isProfileComplete,
        isProfileVerified: response.isProfileVerified,
        completionPercent: response.completionPercent,
      }),
    };
  },
};
