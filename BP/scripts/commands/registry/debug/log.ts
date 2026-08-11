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
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

const LOG_TYPE_ENUM_KEY = "logTypeEnum";
const enum LogTypes {
    debug = "debug",
    info = "info",
    warn = "warn",
}

CommandManager.registerEnum(LOG_TYPE_ENUM_KEY, [LogTypes.debug, LogTypes.info, LogTypes.warn]);

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
        switch (logType) {
            case LogTypes.debug:
                console.log(message);
                break;
            case LogTypes.info:
                console.info(message);
                break;
            case LogTypes.warn:
                console.warn(message);
                break;
        }
        return {
            status: CustomCommandStatus.Success,
            message: `Logged ${logType} message to the console`,
        };
    }
);
