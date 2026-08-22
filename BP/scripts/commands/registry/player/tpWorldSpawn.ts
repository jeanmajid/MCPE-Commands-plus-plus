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
    system,
    world,
    Player,
} from "@minecraft/server";

import { Dimensions } from "../../../constants/dimensions.js";
import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "tpworldspawn",
        description: "Teleports the target to the world spawn point",
        permissionLevel: CommandPermissionLevel.GameDirectors,

        optionalParameters: [{ name: "target", type: CustomCommandParamType.PlayerSelector }],
    },
    (origin, targets: Player[]) => {
        if (!targets || targets.length === 0) {
            const sourceEntity = origin.sourceEntity;
            if (sourceEntity instanceof Player) {
                system.run(() => {
                    teleportPlayersToWorldSpawn([sourceEntity]);
                });

                return {
                    status: CustomCommandStatus.Success,
                    message: "Sucessfully teleported entity",
                };
            }

            return { status: CustomCommandStatus.Failure, message: "No targets" };
        }

        system.run(() => {
            teleportPlayersToWorldSpawn(targets);
        });
        return { status: CustomCommandStatus.Success, message: "Sucessfully teleported entities" };
    }
);

export function teleportPlayersToWorldSpawn(targets: Player[]): void {
    const worldSpawn = world.getDefaultSpawnLocation();

    for (const target of targets) {
        target.teleport(worldSpawn);
    }

    const dimension = Dimensions.overworld;

    const intervalId = system.runInterval(() => {
        if (!dimension.isChunkLoaded({ ...worldSpawn, y: 100 })) {
            return;
        }

        const topBlock = Dimensions.overworld.getTopmostBlock({ x: worldSpawn.x, z: worldSpawn.z });
        const tpLocation = topBlock?.location ?? { x: 0, y: 0, z: 0 };
        tpLocation.y += 1;

        const teleportLocation = { ...tpLocation, dimension: Dimensions.overworld };

        for (const target of targets) {
            target.teleport(teleportLocation);
        }

        system.clearRun(intervalId);
    }, 3);
}
