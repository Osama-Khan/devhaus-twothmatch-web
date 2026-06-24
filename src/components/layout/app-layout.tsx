"use client";

import { AppThemeProvider } from "@/lib/theme/theme-provider";
import { StoreProvider } from "@/lib/store/providers";
import { Toaster } from "@/components/ui/sonner";

type AppLayoutProps = {
  children: React.ReactNode;
};

/**
 * Root client provider stack: theme, Redux, and toasts.
 * Wraps all routes from the root layout.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppThemeProvider>
      <StoreProvider>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </StoreProvider>
    </AppThemeProvider>
  );
}
