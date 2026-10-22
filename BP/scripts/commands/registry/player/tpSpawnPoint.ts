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

// IDEA: support entities, need to load spawn area manually tho

import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Player,
    system,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { teleportPlayersToWorldSpawn } from "../entity/tpWorldSpawn.js";

CommandManager.register(
    {
        name: "tpspawnpoint",
        description: "Teleports all targets to their spawnpoint",
        permissionLevel: CommandPermissionLevel.GameDirectors,

        optionalParameters: [{ name: "targets", type: CustomCommandParamType.PlayerSelector }],
    },
    (origin, targets: Player[]) => {
        const sourceEntity = origin.sourceEntity;

        if (!targets) {
            if (sourceEntity instanceof Player) {
                targets = [sourceEntity];
            } else {
                return { status: CustomCommandStatus.Failure, message: "Invalid targets" };
            }
        } else if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        const nonSpawnPlayers: Player[] = [];

        for (const target of targets) {
            const spawnPoint = target.getSpawnPoint();
            if (spawnPoint) {
                system.run(() => {
                    target.teleport(spawnPoint);
                });
            } else {
                nonSpawnPlayers.push(target);
            }
        }

        if (nonSpawnPlayers.length > 0) {
            system.run(() => {
                teleportPlayersToWorldSpawn(nonSpawnPlayers);
            });
        }

        return { status: CustomCommandStatus.Success, message: "Sucessfully teleported entities" };
    }
);

// const { x, z } = world.getDefaultSpawnLocation();
// const topBlock = Dimensions.overworld.getTopmostBlock({ x: x, z: z });
// spawnPoint = {
//     ...(topBlock?.location ?? FALLBACK_SPAWN_POINT),
//     dimension: Dimensions.overworld,
// };
