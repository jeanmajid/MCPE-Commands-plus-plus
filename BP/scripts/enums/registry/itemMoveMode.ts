import { EnumManager } from "../enum.js";

export const ITEM_MOVE_MODE_ENUM_KEY = "itemMoveMode";
export enum ItemMoveMode {
    swap = "swap",
    copy = "copy",
    move = "move",
}

EnumManager.register(ITEM_MOVE_MODE_ENUM_KEY, Object.values(ItemMoveMode));
