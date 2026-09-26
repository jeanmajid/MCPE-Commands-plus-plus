import { EnumManager } from "../enum.js";

export const FMBE_TYPE_ENUM_KEY = "fmbeTypeEnum";
export enum FmbeType {
    standard = "standard",
    simple = "simple",
    advanced2d = "advanced_2d",
    advanced3d = "advanced_3d",
    advancedItems = "advanced_items",
}

EnumManager.register(FMBE_TYPE_ENUM_KEY, Object.values(FmbeType));
