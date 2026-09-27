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
    CustomCommandStatus,
    CustomCommandParamType,
    Player,
    world,
    World,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { FMResult, FUNCTION_MANAGER } from "../../managers/functionsManager.js";

CommandManager.register(
    {
        name: "sequencelist",
        description: "",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [{ name: "sequenceName", type: CustomCommandParamType.String }],
    },
    (origin, sequenceName?: string) => {
        // TODO: use world.sendMessage or origin.sendMessage, or include in message output? Afaik the message has pretty limited length

        const target: Player | World =
            origin.sourceEntity instanceof Player
                ? origin.sourceEntity
                : origin.initiator instanceof Player
                  ? origin.initiator
                  : world;

        if (sequenceName) {
            const data = FUNCTION_MANAGER.getFunctionData(sequenceName);
            switch (data.result) {
                case FMResult.Success: {
                    target.sendMessage(
                        `Listing commands:\n` +
                            data
                                .data!.map((_, i) => `${(i + 1).toString().padStart(2)}: ${_}`)
                                .join("\n")
                    );
                    return {
                        status: CustomCommandStatus.Success,
                        message: `Successfully listed ${data.data?.length} lines from <sequence>/${sequenceName}`,
                    };
                }

                case FMResult.InvalidName:
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "Function name contains invalid characters",
                    };

                case FMResult.NotFound:
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "Function not found, <sequence>/" + sequenceName,
                    };
            }

            return {
                status: CustomCommandStatus.Failure,
                message: "Unexpected bug, report this issue to github repository",
            };
        }

        const functionNames = FUNCTION_MANAGER.db.keys();

        target.sendMessage(
            `Listing available sequences:\n` + functionNames.map((_) => `- ${_}`).join("\n")
        );
        return {
            status: CustomCommandStatus.Success,
            message: `Successfully listed ${functionNames.length} sequence(s)`,
        };
    }
);
