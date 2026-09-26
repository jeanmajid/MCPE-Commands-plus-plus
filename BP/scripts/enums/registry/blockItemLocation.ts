import { EnumManager } from "../enum.js";

export const BLOCK_ITEM_LOCATIONS_ENUM_KEY = "blockItemLocationsEnum";
export enum BlockItemLocations {
    slotContainer = "slot.container",
}

EnumManager.register(BLOCK_ITEM_LOCATIONS_ENUM_KEY, Object.values(BlockItemLocations));
