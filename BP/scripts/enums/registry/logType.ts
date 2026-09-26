import { EnumManager } from "../enum.js";

export const LOG_TYPE_ENUM_KEY = "logTypeEnum";
export enum LogType {
    info = "info",
    warn = "warn",
    error = "error",
    chat = "chat",
    none = "none",
}

EnumManager.register(LOG_TYPE_ENUM_KEY, Object.values(LogType));
