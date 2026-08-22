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

// IDEA: support entities, need to load spawn area manually tho

import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Player,
    system,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { teleportPlayersToWorldSpawn } from "./tpWorldSpawn.js";

CommandManager.registerCommand(
    {
        name: "tpspawnpoint",
        description: "Teleports the target to their spawnpoint",
        permissionLevel: CommandPermissionLevel.GameDirectors,

        optionalParameters: [{ name: "target", type: CustomCommandParamType.PlayerSelector }],
    },
    (origin, targets: Player[]) => {
        const sourceEntity = origin.sourceEntity;

        if (!targets && sourceEntity instanceof Player) {
            targets = [sourceEntity];
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
