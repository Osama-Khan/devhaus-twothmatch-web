import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AppDataState = {
  /** Sidebar collapsed state and other UI preferences */
  sidebarCollapsed: boolean;
};

const initialState: AppDataState = {
  sidebarCollapsed: false,
};

export const appDataSlice = createSlice({
  name: "appData",
  initialState,
  reducers: {
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const { setSidebarCollapsed } = appDataSlice.actions;

export default appDataSlice.reducer;
