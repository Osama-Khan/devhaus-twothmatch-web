import type { ConfigType } from "@/features/config/types/config-type";
import type { SettingType } from "@/features/config/types/setting-type";

/** Single config or setting metadata row returned by the V2 API */
export type MetadataItem = {
  id: string;
  name: string;
};

/** Response from `GET /v2/config/{type}` */
export type ConfigByTypeResponse = {
  type: ConfigType;
  items: MetadataItem[];
};

/** Response from `GET /v2/settings/{type}` */
export type SettingByTypeResponse = {
  type: SettingType;
  items: MetadataItem[];
};
