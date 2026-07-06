"use client";

import type { SettingByTypeResponse } from "@/features/config/types/metadata-response";
import type { SettingType } from "@/features/config/types/setting-type";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";

function settingByTypePath(type: SettingType): string {
  return `${externalApiRoutes.settings.byType._self.path}/${type}`;
}

/**
 * Client-side settings service.
 * No auth required.
 */
export const settingsService = {
  /** GET `/{root}/settings/{type}` — returns app setting rows for a known settings key */
  getByType(
    type: SettingType
  ): Promise<AppResponseType<SettingByTypeResponse>> {
    return apiFetcher.get<SettingByTypeResponse>(settingByTypePath(type), {
      skipAuth: true,
    });
  },
};
