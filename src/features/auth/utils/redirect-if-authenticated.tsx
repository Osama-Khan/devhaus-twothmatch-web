"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { useAuthSelector } from "@/lib/store/hooks";

type RedirectIfAuthenticatedProps = {
  children: React.ReactNode;
  /** Where to send already-authenticated users */
  redirectTo?: string;
};

/**
 * Client guard for auth pages — redirects signed-in users away from login/register.
 */
export function RedirectIfAuthenticated({
  children,
  redirectTo = appRoutes.home._self.path,
}: RedirectIfAuthenticatedProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthSelector();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return children;
}
