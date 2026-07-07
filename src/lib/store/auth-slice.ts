import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/lib/types/entities";

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True while hydrating from storage or validating token */
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
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
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setAuthLoading, setCredentials, setTokenSession, setUser, clearCredentials } =
  authSlice.actions;

export default authSlice.reducer;
