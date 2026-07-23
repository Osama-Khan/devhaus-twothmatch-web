"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthSelector } from "@/lib/store/hooks";
import { getProfileSetupPath } from "@/features/onboarding/utils/get-profile-setup-path";

/**
 * Redirects users to a locked route (candidate gate, onboarding, or verification).
 */
export function ProfileSetupLock() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuthSelector();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      return;
    }

    const setupPath = getProfileSetupPath(user);
    if (!setupPath) {
      return;
    }

    if (pathname === setupPath || pathname.startsWith(`${setupPath}/`)) {
      return;
    }

    router.replace(setupPath);
  }, [isAuthenticated, isLoading, user, pathname, router]);

  return null;
}
