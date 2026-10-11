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
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { FMResult, FUNCTION_MANAGER } from "../../managers/functionsManager.js";

CommandManager.register(
    {
        name: "sequencepop",
        aliases: ["seqpop"],
        description: "Pops or removed specific line from a sequence of commands",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "sequenceName", type: CustomCommandParamType.String }],
        optionalParameters: [{ name: "line", type: CustomCommandParamType.Integer }],
    },
    (origin, sequenceName: string, line?: number) => {
        if (line !== undefined) {
            line -= 1; // map to index

            if (line < 0) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Line has to be positive integer",
                };
            }
        }

        const status = FUNCTION_MANAGER.popC(sequenceName, line);

        switch (status) {
            case FMResult.Success:
                return {
                    status: CustomCommandStatus.Success,
                    message:
                        "Successfully popped or removed one line from <sequence>/" + sequenceName,
                };

            case FMResult.Empty:
                return {
                    status: CustomCommandStatus.Failure,
                    message:
                        "Failed to remove any line from empty sequence <sequence>/" + sequenceName,
                };

            case FMResult.InvalidName:
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Sequence name contains invalid characters",
                };

            case FMResult.NotFound:
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Sequence not found, <sequence>/" + sequenceName,
                };
        }

        return {
            status: CustomCommandStatus.Failure,
            message: "Unexpected bug, report this issue to github repository",
        };
    }
);
