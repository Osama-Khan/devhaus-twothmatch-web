import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaymentEntitlement } from "@/features/payments/types";
import type { User } from "@/lib/types/entities";

export type AuthState = {
  user: User | null;
  /** Effective billing entitlement; null when logged out or not yet loaded */
  entitlement: PaymentEntitlement | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True while hydrating from storage or validating token */
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  entitlement: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

type SetCredentialsPayload = {
  user: User;
  token: string;
  /** When provided (including `null`), replaces stored entitlement */
  entitlement?: PaymentEntitlement | null;
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setCredentials(state, action: PayloadAction<SetCredentialsPayload>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      if ("entitlement" in action.payload) {
        state.entitlement = action.payload.entitlement ?? null;
      }
    },
    /** Keeps a stored JWT session when profile hydration fails transiently. */
    setTokenSession(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setEntitlement(state, action: PayloadAction<PaymentEntitlement | null>) {
      state.entitlement = action.payload;
    },
    clearCredentials(state) {
      state.user = null;
      state.entitlement = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const {
  setAuthLoading,
  setCredentials,
  setTokenSession,
  setUser,
  setEntitlement,
  clearCredentials,
} = authSlice.actions;

export default authSlice.reducer;
