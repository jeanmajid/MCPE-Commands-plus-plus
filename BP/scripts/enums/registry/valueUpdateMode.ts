import { EnumManager } from "../enum.js";

export enum ValueUpdateMode {
    add = "add",
    remove = "remove",
    set = "set",
}

export const VALUE_UPDATE_MODE_ENUM_KEY = "valueUpdateMode";

EnumManager.register(VALUE_UPDATE_MODE_ENUM_KEY, Object.values(ValueUpdateMode));
