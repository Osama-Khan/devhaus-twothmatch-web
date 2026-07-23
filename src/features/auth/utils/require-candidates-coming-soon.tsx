"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { useAuthSelector } from "@/lib/store/hooks";
import { getPostAuthPath } from "@/features/onboarding/utils/get-post-auth-path";
import { isCandidateUser } from "@/features/auth/utils/is-candidate-user";

type RequireCandidatesComingSoonProps = {
  children: React.ReactNode;
};

/**
 * Client guard for the candidates coming-soon page — auth + candidate role only.
 */
export function RequireCandidatesComingSoon({
  children,
}: RequireCandidatesComingSoonProps) {
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

    if (user && !isCandidateUser(user)) {
      router.replace(getPostAuthPath(user));
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading || !isAuthenticated || !user || !isCandidateUser(user)) {
    return null;
  }

  return children;
}
