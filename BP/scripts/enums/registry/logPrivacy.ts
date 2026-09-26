import { EnumManager } from "../enum.js";

export const LOG_PRIVACY_ENUM_KEY = "logPrivacyEnum";
export enum LogPrivacy {
    public = "public",
    private = "private",
}

EnumManager.register(LOG_PRIVACY_ENUM_KEY, Object.values(LogPrivacy));
