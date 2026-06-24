"use client";

import { useAuthSelector, useAppDispatch } from "@/lib/store/hooks";
import { clearCredentials } from "@/lib/store/auth-slice";
import { authService } from "@/features/auth/services/auth-service";

/**
 * Auth state and actions backed by Redux + external API JWT flow.
 */
export function useAuth() {
  const auth = useAuthSelector();
  const dispatch = useAppDispatch();

  const logout = async () => {
    await authService.logout();
    dispatch(clearCredentials());
  };

  return {
    ...auth,
    logout,
  };
}
