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
    system,
    Dimension,
    Entity,
} from "@minecraft/server";

import { Dimensions } from "../../../constants/dimensions.js";
import { CommandManager } from "../../command.js";
import { FMResult, FUNCTION_MANAGER } from "../../managers/functionsManager.js";
import { getIsRunning, setIsRunning } from "./sequenceAbort.js";

CommandManager.register(
    {
        name: "sequencerun",
        aliases: ["seqrun"],
        description: "Runs a sequence matching specified name",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "sequenceName", type: CustomCommandParamType.String }],
    },
    (origin, sequenceName: string) => {
        const data = FUNCTION_MANAGER.getFunctionData(sequenceName);
        if (!data.data) {
            switch (data.result) {
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
        const dimension: Dimension | null =
            origin.sourceEntity?.dimension ??
            origin.sourceBlock?.dimension ??
            origin.initiator?.dimension ??
            null;

        const target: Dimension | Entity | null = origin.sourceEntity ?? origin.initiator ?? null;

        const commands = data.data;
        system.run(() => {
            const src = target ?? dimension ?? Dimensions.overworld;

            setIsRunning(true);
            for (const command of commands) {
                if (!getIsRunning()) break;
                src.runCommand(command);
            }
            setIsRunning(false);
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Successfully queued '<sequence>/${sequenceName}' with ${commands.length} command(s)`,
        };
    }
);
