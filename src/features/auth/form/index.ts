import { z } from "zod";

/** Shared email validator */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Enter a valid email address");

/** Shared password validator */
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const userRoleSchema = z.enum(["candidate", "practice"]);

/** Login form validation — maps to POST `/auth/login` */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/** Registration form validation — maps to POST `/auth/signup` */
export const registerSchema = z
  .object({
    email: emailSchema,
    fullName: z.string().min(1, "Full name is required"),
    mobileNumber: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^\+?[0-9\s-]{7,20}$/, "Enter a valid mobile number"),
    role: userRoleSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/** Email OTP verification — maps to POST `/auth/verify-email` */
export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: z
    .string()
    .min(6, "Enter the 6-digit code")
    .max(6, "Enter the 6-digit code")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});

/** Forgot password — maps to POST `/auth/forgot-password` */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/** Reset password — maps to POST `/auth/reset-password` */
export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    code: z.string().min(6, "Enter the reset code"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
