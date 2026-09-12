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
    Entity,
    system,
} from "@minecraft/server";

import { getScoreboardObjective } from "../../../utils/getObjective.js";
import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "scorerandom",
        description:
            "Outputs a random score value to the target objective, optionally between a min and max value",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.EntitySelector },
            { name: "targetObjective", type: CustomCommandParamType.String },
        ],
        optionalParameters: [
            { name: "min", type: CustomCommandParamType.Integer },
            { name: "max", type: CustomCommandParamType.Integer },
        ],
    },
    (origin, targets: Entity[], targetObjective: string, min: number, max: number) => {
        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            const objective = getScoreboardObjective(targetObjective);

            for (const target of targets) {
                objective.setScore(target, randomSigned32BitInteger(min, max));
            }
        });

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully updated targets scores",
        };
    }
);

function randomSigned32BitInteger(min?: number, max?: number): number {
    if (min === undefined) {
        min = -2147438648;
    }

    if (max === undefined) {
        max = 2147438647;
    }

    return Math.floor(Math.random() * (max + Math.abs(min)) - max);
}
