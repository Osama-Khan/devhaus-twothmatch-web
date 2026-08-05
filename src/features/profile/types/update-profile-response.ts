/** Response from PUT `/v2/profile` */
export type UpdateProfileResponse = {
  message: string;
  profileId: string;
  /** Whether the profile completion latch is set */
  profileCompletion?: boolean;
  /** Approximate completion percentage (0–100) */
  completionPercent?: number;
};
