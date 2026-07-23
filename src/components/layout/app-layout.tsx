"use client";

import { AppThemeProvider } from "@/lib/theme/theme-provider";
import { StoreProvider } from "@/lib/store/providers";
import { Toaster } from "@/components/ui/sonner";
import { ProfileSetupLock } from "@/features/onboarding/utils/profile-setup-lock";
import { UpgradeRequiredDialogHost } from "@/features/payments/components/upgrade-required-dialog-host";

type AppLayoutProps = {
  children: React.ReactNode;
};

/**
 * Root client provider stack: theme, Redux, and toasts.
 * Wraps all routes from the root layout.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppThemeProvider>
      <StoreProvider>
        <ProfileSetupLock />
        <UpgradeRequiredDialogHost />
        {children}
        <Toaster richColors closeButton position="top-right" />
      </StoreProvider>
    </AppThemeProvider>
  );
}
