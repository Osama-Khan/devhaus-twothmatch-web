"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSelector } from "@/lib/store/hooks";
import { getPostAuthPath } from "@/features/onboarding/utils/get-post-auth-path";

type RedirectIfAuthenticatedProps = {
  children: React.ReactNode;
};

/**
 * Client guard for auth pages — redirects signed-in users away from login/register.
 */
export function RedirectIfAuthenticated({
  children,
}: RedirectIfAuthenticatedProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthSelector();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(getPostAuthPath(user));
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return children;
}
