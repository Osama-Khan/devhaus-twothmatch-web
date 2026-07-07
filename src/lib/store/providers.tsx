"use client";

import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/lib/store";
import {
  clearCredentials,
  setAuthLoading,
  setCredentials,
  setTokenSession,
} from "@/lib/store/auth-slice";
import { clearAuthStorage, getAccessToken } from "@/lib/services/token-storage";
import { registerUnauthorizedHandler } from "@/lib/services/api-fetcher";
import { profileService } from "@/features/profile/services/profile-service";
import { createUserFromProfile } from "@/features/auth/utils/map-profile-response";
import { useAppSelector } from "@/lib/store/hooks";
import {
  isSuccessResponse,
  isUnauthorizedResponse,
} from "@/lib/types/response";
import { logger } from "@/lib/utils/logger";

const storeLogger = logger.child("StoreProvider");

type StoreProviderProps = {
  children: React.ReactNode;
};

/**
 * Hydrates Redux from the stored JWT via GET `/profile`.
 */
function AuthHydrator({ store }: { store: AppStore }) {
  const hydrated = useRef(false);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      storeLogger.warn("Unauthorized API response, clearing session");
      clearAuthStorage();
      store.dispatch(clearCredentials());
    });
  }, [store]);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    async function hydrateAuth() {
      localStorage.removeItem("twothmatch_user");

      const token = getAccessToken();

      if (!token) {
        store.dispatch(setAuthLoading(false));
        return;
      }

      const response = await profileService.getProfile();

      if (isSuccessResponse(response)) {
        const user = createUserFromProfile(response.data);
        store.dispatch(setCredentials({ user, token }));
        return;
      }

      if (isUnauthorizedResponse(response)) {
        clearAuthStorage();
        store.dispatch(clearCredentials());
        return;
      }

      storeLogger.warn("Profile hydration failed, keeping stored session", {
        status: response.status,
      });
      store.dispatch(setTokenSession({ token }));
    }

    void hydrateAuth();
  }, [store]);

  return null;
}

/** Blocks the app shell until auth hydration finishes */
function AuthBootstrapGate({ children }: { children: React.ReactNode }) {
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return children;
}

/** Redux provider with client-side auth hydration */
export function StoreProvider({ children }: StoreProviderProps) {
  const [store] = useState(() => makeStore());

  return (
    <Provider store={store}>
      <AuthHydrator store={store} />
      <AuthBootstrapGate>{children}</AuthBootstrapGate>
    </Provider>
  );
}
