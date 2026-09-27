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
    CustomCommandResult,
    CustomCommandStatus,
    world,
} from "@minecraft/server";

import { LOG_PRIVACY_ENUM_KEY, LogPrivacy } from "../../../enums/registry/logPrivacy.js";
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
            {
                name: "logPrivacy",
                type: CustomCommandParamType.Enum,
                enumName: LOG_PRIVACY_ENUM_KEY,
            },
            { name: "message", type: CustomCommandParamType.String },
        ],
    },
    (origin, logType: LogType, logPrivacy: LogPrivacy, message: string) => {
        return log(message, logType, logPrivacy);
    }
);

const SUCCESSFUL_LOG_OUTPUT = {
    status: CustomCommandStatus.Success,
    message: `Logged message to the console`,
};

export function log(
    message: string,
    logType: string,
    logPrivacy: string = LogPrivacy.public
): CustomCommandResult {
    if (logPrivacy) {
        return {
            status: CustomCommandStatus.Success,
            message: "Logs are private; enable with </config showPrivateLogs true>",
        };
    }

    switch (logType) {
        case LogType.none:
            return SUCCESSFUL_LOG_OUTPUT;
        case LogType.info:
            console.info(message);
            return SUCCESSFUL_LOG_OUTPUT;
        case LogType.warn:
            console.warn(message);
            return SUCCESSFUL_LOG_OUTPUT;
        case LogType.error:
            console.error(message);
            return SUCCESSFUL_LOG_OUTPUT;
        case LogType.chat:
            world.sendMessage(message);
            return SUCCESSFUL_LOG_OUTPUT;
        default:
            return { status: CustomCommandStatus.Failure, message: "Invalid log type" };
    }
}
