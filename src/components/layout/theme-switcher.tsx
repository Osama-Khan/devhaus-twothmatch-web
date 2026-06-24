"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { isDarkModeEnabled } from "@/lib/theme/theme-config";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";

/** Toggle between light and dark themes */
export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  if (!isDarkModeEnabled) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="relative"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <HugeiconsIcon
        icon={Sun03Icon}
        strokeWidth={2}
        className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
      />
      <HugeiconsIcon
        icon={Moon02Icon}
        strokeWidth={2}
        className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
      />
    </Button>
  );
}
