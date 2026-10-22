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
    world,
    system,
    CustomCommandParamType,
    Entity,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "entitycount",
        description:
            "Returns the count of all loaded targets to a fakeplayer's scoreboard objective",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.EntitySelector },
            { name: "fakeplayer", type: CustomCommandParamType.String },
            { name: "objective", type: CustomCommandParamType.String },
        ],
    },
    (origin, targets: Entity[], fakeplayer: string, objective: string) => {
        const scoreboard = world.scoreboard;
        const entityCount = targets.length;

        const score = scoreboard.getObjective(objective) ?? scoreboard.addObjective(objective);

        system.run(() => {
            score.setScore(fakeplayer, entityCount);
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Set [${objective}] for ${fakeplayer} to ${entityCount}`,
        };
    }
);
