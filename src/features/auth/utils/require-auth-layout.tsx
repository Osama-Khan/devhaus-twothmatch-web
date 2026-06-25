"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { useAuthSelector } from "@/lib/store/hooks";
import { needsOnboarding } from "@/features/onboarding/utils/needs-onboarding";
import { needsVerification } from "@/features/onboarding/utils/needs-verification";
import { getProfileSetupPath } from "@/features/onboarding/utils/get-profile-setup-path";

type RequireAuthLayoutProps = {
  children: React.ReactNode;
};

/**
 * Client guard for authenticated app routes — login required, onboarding enforced.
 */
export function RequireAuthLayout({ children }: RequireAuthLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthSelector();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(appRoutes.auth.login._self.path);
      return;
    }

    const setupPath = user ? getProfileSetupPath(user) : null;
    if (setupPath) {
      router.replace(setupPath);
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (
    isLoading ||
    !isAuthenticated ||
    needsOnboarding(user) ||
    needsVerification(user)
  ) {
    return null;
  }

  return children;
}
