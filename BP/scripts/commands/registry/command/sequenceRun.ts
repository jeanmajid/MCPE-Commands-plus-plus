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
    Vector3,
    Vector2,
    Dimension,
    Entity,
} from "@minecraft/server";

import { Dimensions } from "../../../constants/dimensions.js";
import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";
import { FMResult, FUNCTION_MANAGER } from "../../managers/functionsManager.js";

CommandManager.register(
    {
        name: "sequencerun",
        description: "",
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

        const location: Vector3 | null =
            origin.sourceEntity?.location ??
            origin.sourceBlock?.location ??
            origin.initiator?.location ??
            null;

        const rotation: Vector2 | null =
            origin.sourceEntity?.getRotation() ?? origin.initiator?.getRotation() ?? null;

        const dimension: Dimension | null =
            origin.sourceEntity?.dimension ??
            origin.sourceBlock?.dimension ??
            origin.initiator?.dimension ??
            null;

        const target: Dimension | Entity | null = origin.sourceEntity ?? origin.initiator ?? null;

        // should return the execute offset right? or am i doing something wrong?
        // please jean help me
        console.log("at: " + Vector.toString(location!));
        const commands = data.data;
        system.run(() => {
            let execute = false;
            let options = "";
            if (!target) {
                execute = true;
                options += ` positioned ${Vector.toCommandsString(location ?? { x: 0, y: 0, z: 0 })}`;
            } else {
                if (dimension && dimension !== target.dimension) {
                    execute = true;
                    options += ` in ${dimension.id}`;
                }

                if (location && !Vector.equal(target.location, location)) {
                    execute = true;
                    options += ` positioned ${Vector.toCommandsString(location ?? { x: 0, y: 0, z: 0 })}`;
                }

                if (rotation && !Vector.equalXY(target.getRotation(), rotation)) {
                    execute = true;
                    options += ` rotated ${rotation.x} ${rotation.y}`;
                }
            }

            let prefix = "";
            if (execute) {
                prefix = "execute" + options + " run ";
            }

            const src = target ?? dimension ?? Dimensions.overworld;

            for (const command of commands) {
                src.runCommand(prefix + command);
                console.log("running: " + prefix + command);
            }
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Successfully queued '<sequence>/${sequenceName}' with ${commands.length} command(s)`,
        };
    }
);
