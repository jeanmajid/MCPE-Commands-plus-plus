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

import { MIN_SIGNED_INT32, MAX_SIGNED_INT32 } from "../../../constants/unsignedInt32.js";
import { getScoreboardObjective } from "../../../utils/score.js";
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
        if (min > max) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Maximum value must be greater than the minimum value",
            };
        }

        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            const objective = getScoreboardObjective(targetObjective);

            for (const target of targets) {
                if (!target.isValid) {
                    continue;
                }
                objective.setScore(target, randomSignedInt32(min, max));
            }
        });

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully updated targets scores",
        };
    }
);

function randomSignedInt32(min?: number, max?: number): number {
    if (min === undefined) {
        min = MIN_SIGNED_INT32;
    }

    if (max === undefined) {
        max = MAX_SIGNED_INT32;
    }

    const range = max - min + 1;
    return Math.floor(Math.random() * range + min);
}
