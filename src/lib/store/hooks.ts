import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./index";

/** Typed dispatch hook */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** Typed selector hook */
export const useAppSelector = useSelector.withTypes<RootState>();

/** Typed store hook */
export const useAppStore = useStore.withTypes<AppStore>();

/** Convenience selector for auth state */
export const useAuthSelector = () => useAppSelector((state) => state.auth);

/** Convenience selector for app data state */
export const useAppDataSelector = () =>
  useAppSelector((state) => state.appData);
