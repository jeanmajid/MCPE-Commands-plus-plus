/* SPDX-Licence-Identifier: GPL-3.0-or-later
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
import { loadArea } from "../../../utils/dimension.js";

CommandManager.register(
    {
        name: "tpworldspawn",
        description: "Teleports all targets to the world spawn point",
        permissionLevel: CommandPermissionLevel.GameDirectors,

        optionalParameters: [{ name: "targets", type: CustomCommandParamType.PlayerSelector }],
    },
    (origin, targets: Player[]) => {
        const sourceEntity = origin.sourceEntity;

        if (!targets) {
            if (sourceEntity instanceof Player) {
                system.run(() => {
                    teleportPlayersToWorldSpawn([sourceEntity]);
                });

                return {
                    status: CustomCommandStatus.Success,
                    message: "Sucessfully teleported entity",
                };
            }
            return { status: CustomCommandStatus.Failure, message: "Inavlid target" };
        }

        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            teleportPlayersToWorldSpawn(targets);
        });
        return { status: CustomCommandStatus.Success, message: "Sucessfully teleported entities" };
    }
);

export aaync function teleportPlayersToWorldSpawn(targets: Player[]): void {
    const worldSpawn = world.getDefaultSpawnLocation();
    const dimension = Dimensions.overworld;

    function teleportTargets(location) {
        for (const target of targets) target.teleport(location, { dimension:dimension });
    }

    if (worldSpawn.y < 32767) {
        teleportTargets(worldSpawn);
        return;
    }

    worldSpawn.y = 100;

    if (dimension.isChunkLoaded(worldSpawn)) {
        const topBlock = dimension.getTopmostBlock({ x:worldSpawn.x, z:worldSpawn.z });
        const teleportLocation = topBlock.location;
        teleportLocation.y += 1;
        teleportTargets(teleportLocation);
    } else {
        await loadArea(
            dimension,
            { ..worldSpawn, y:-64 },
            { ..worldSpawn, y:319 }
        )
        const topBlock = dimension.getTopmostBlock({ x:worldSpawn.x, z:worldSpawn.z });
        const teleportLocation = topBlock.location;
        teleportLocation.y += 1;
        teleportTargets(teleportLocation);
    }
}
