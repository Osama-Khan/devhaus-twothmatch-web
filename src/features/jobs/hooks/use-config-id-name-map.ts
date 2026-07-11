"use client";

import { useMemo } from "react";
import { useConfigByType } from "@/features/config/hooks/use-config-by-type";
import type { ConfigType } from "@/features/config/types/config-type";

/** Map of config item id → display name for a given config type */
export function useConfigIdNameMap(type: ConfigType): Map<string, string> {
  const { items } = useConfigByType(type);
  return useMemo(
    () => new Map(items.map((item) => [item.id, item.name])),
    [items]
  );
}
