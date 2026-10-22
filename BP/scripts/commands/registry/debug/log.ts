/* SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Licensed under the PolyForm Noncommercial License 1.0.0.
 * You may use, modify, and redistribute this software for permitted
 * noncommercial purposes, subject to the terms of that license.
 *
 * Commercial use requires separate authorization from the applicable
 * copyright holder.
 *
 * The complete license text is available at:
 * https://polyformproject.org/licenses/noncommercial/1.0.0
 */

import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandResult,
    CustomCommandStatus,
    world,
} from "@minecraft/server";

import { LOG_TYPE_ENUM_KEY, LogType } from "../../../enums/registry/logType.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "log",
        description:
            "Logs a message to the content log console if enabled in the user's Creator settings",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "logType", type: CustomCommandParamType.Enum, enumName: LOG_TYPE_ENUM_KEY },
            { name: "message", type: CustomCommandParamType.String },
        ],
    },
    (origin, logType: LogType, message: string) => {
        return log(message, logType);
    }
);

const SUCCESSFUL_LOG_OUTPUT = {
    status: CustomCommandStatus.Success,
    message: `Logged message to the console`,
};

export function log(message: string, logType: string): CustomCommandResult {
    switch (logType) {
        case LogType.None:
            return SUCCESSFUL_LOG_OUTPUT;
        case LogType.Info:
            console.info(message);
            return SUCCESSFUL_LOG_OUTPUT;
        case LogType.Warn:
            console.warn(message);
            return SUCCESSFUL_LOG_OUTPUT;
        case LogType.Error:
            console.error(message);
            return SUCCESSFUL_LOG_OUTPUT;
        case LogType.Chat:
            world.sendMessage(message);
            return SUCCESSFUL_LOG_OUTPUT;
        default:
            return { status: CustomCommandStatus.Failure, message: "Invalid log type" };
    }
}
