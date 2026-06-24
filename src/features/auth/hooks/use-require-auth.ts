"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { useAuthSelector } from "@/lib/store/hooks";

/**
 * Redirects unauthenticated users to the login page.
 * Use in client components that require auth.
 */
export function useRequireAuth(redirectTo = appRoutes.auth.login._self.path) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthSelector();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading };
}
