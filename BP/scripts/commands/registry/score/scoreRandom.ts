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
    CustomCommandStatus,
    CustomCommandParamType,
    Entity,
    system,
} from "@minecraft/server";

import { Random } from "../../../utils/number.js";
import { getScoreboardObjective } from "../../../utils/score.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
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
                objective.setScore(target, Random.signedInt32(min, max));
            }
        });

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully updated targets scores",
        };
    }
);
