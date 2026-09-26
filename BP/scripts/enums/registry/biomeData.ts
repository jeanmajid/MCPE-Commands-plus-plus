import { EnumManager } from "../enum.js";

export const BIOME_DATA_ENUM_KEY = "biomeDataEnum";
export enum BiomeData {
    all = "all",
    tags = "tags",
    id = "id",
}

EnumManager.register(BIOME_DATA_ENUM_KEY, Object.values(BiomeData));
