"use client";

import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/lib/store";
import {
  clearCredentials,
  setAuthLoading,
  setCredentials,
} from "@/lib/store/auth-slice";
import {
  clearAuthStorage,
  getAccessToken,
  getUserSnapshot,
  setUserSnapshot,
} from "@/lib/services/token-storage";
import { authService } from "@/features/auth/services/auth-service";
import { mergeProfileMe } from "@/features/auth/utils/map-profile-me";
import { isSuccessResponse } from "@/lib/types/response";
import { logger } from "@/lib/utils/logger";

const storeLogger = logger.child("StoreProvider");

type StoreProviderProps = {
  children: React.ReactNode;
};

/**
 * Hydrates Redux from localStorage, then validates JWT via GET `/profile/me`.
 */
function AuthHydrator({ store }: { store: AppStore }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    async function hydrateAuth() {
      const token = getAccessToken();
      const snapshot = getUserSnapshot();

      if (!token) {
        store.dispatch(setAuthLoading(false));
        return;
      }

      if (snapshot) {
        store.dispatch(setCredentials({ user: snapshot, token }));
      }

      const response = await authService.getProfileMe();

      if (isSuccessResponse(response)) {
        const baseUser = snapshot ?? {
          id: response.data.profile.id,
          email: "",
          role: response.data.kind === "practice" ? "practice" : "candidate",
        };
        const user = mergeProfileMe(baseUser, response.data);
        store.dispatch(setCredentials({ user, token }));
        setUserSnapshot(user);
        return;
      }

      storeLogger.warn("Token validation failed, clearing session");
      clearAuthStorage();
      store.dispatch(clearCredentials());
    }

    void hydrateAuth();
  }, [store]);

  return null;
}

/** Redux provider with client-side auth hydration */
export function StoreProvider({ children }: StoreProviderProps) {
  const [store] = useState(() => makeStore());

  return (
    <Provider store={store}>
      <AuthHydrator store={store} />
      {children}
    </Provider>
  );
}
