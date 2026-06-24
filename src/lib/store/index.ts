import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import appDataReducer from "./app-data-slice";

/** Redux store — client-only UI and session-adjacent state */
export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      appData: appDataReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
