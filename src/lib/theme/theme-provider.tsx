"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { isDarkModeEnabled } from "@/lib/theme/theme-config";

/**
 * Wraps next-themes with app defaults.
 * Toggles the `dark` class on `<html>` for Tailwind dark mode.
 */
export function AppThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={isDarkModeEnabled ? "system" : "light"}
      enableSystem={isDarkModeEnabled}
      forcedTheme={isDarkModeEnabled ? undefined : "light"}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
