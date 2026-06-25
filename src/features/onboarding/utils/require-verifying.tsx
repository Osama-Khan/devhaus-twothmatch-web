"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { useAuthSelector } from "@/lib/store/hooks";
import { getPostAuthPath } from "@/features/onboarding/utils/get-post-auth-path";
import { needsOnboarding } from "@/features/onboarding/utils/needs-onboarding";
import { needsVerification } from "@/features/onboarding/utils/needs-verification";

type RequireVerifyingProps = {
  children: React.ReactNode;
};

/**
 * Client guard for verification — requires auth and a complete but unverified profile.
 */
export function RequireVerifying({ children }: RequireVerifyingProps) {
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

    if (user && needsOnboarding(user)) {
      router.replace(appRoutes.onboarding._self.path);
      return;
    }

    if (user && !needsVerification(user)) {
      router.replace(getPostAuthPath(user));
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (
    isLoading ||
    !isAuthenticated ||
    !user ||
    needsOnboarding(user) ||
    !needsVerification(user)
  ) {
    return null;
  }

  return children;
}
