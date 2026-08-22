/* SPDX-License-Identifier: GPL-3.0-or-later
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Commands Plus Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Commands Plus Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Commands Plus Plus. If not, see <https://www.gnu.org/licenses/>.
 */


import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    world,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

export const LOG_TYPE_ENUM_KEY = "logTypeEnum";
export enum LogTypes {
    info = "info",
    warn = "warn",
    error = "error",
    chat = "chat",
}

CommandManager.registerEnum(LOG_TYPE_ENUM_KEY, Object.values(LogTypes));

CommandManager.registerCommand(
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
    (origin, logType: string, message: string) => {
        log(message, logType);
        return {
            status: CustomCommandStatus.Success,
            message: `Logged ${logType} message to the console`,
        };
    }
);

export function log(message: string, logType: string): void {
    switch (logType) {
        case LogTypes.info:
            console.info(message);
            break;
        case LogTypes.warn:
            console.warn(message);
            break;
        case LogTypes.error:
            console.error(message);
            break;
        case LogTypes.chat:
            world.sendMessage(message);
            break;
    }
}
