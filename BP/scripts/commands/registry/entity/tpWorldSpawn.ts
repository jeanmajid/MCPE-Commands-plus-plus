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
    system,
    world,
    Player,
    Vector3,
    Entity,
} from "@minecraft/server";

import { Dimensions } from "../../../constants/dimensions.js";
import { loadArea } from "../../../utils/dimension.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "tpworldspawn",
        description: "Teleports all targets to the world spawn point",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [{ name: "targets", type: CustomCommandParamType.EntitySelector }],
    },
    (origin, targets: Entity[]) => {
        const sourceEntity = origin.sourceEntity;

        if (!targets) {
            if (sourceEntity instanceof Entity) {
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

        return { status: CustomCommandStatus.Success, message: "Sucessfully teleported entity(s)" };
    }
);

export async function teleportPlayersToWorldSpawn(targets: Entity[]): Promise<void> {
    const worldSpawn = world.getDefaultSpawnLocation();
    const dimension = Dimensions.overworld;

    function teleportTargets(location: Vector3): void {
        for (const target of targets) {
            target.teleport(location, { dimension: dimension });
        }
    }

    if (worldSpawn.y < 32767) {
        teleportTargets(worldSpawn);
        return;
    }

    function getHighestAirLocation(x: number, z: number): Vector3 {
        const location = dimension.getTopmostBlock({ x: x, z: z })?.location ?? {
            x: x,
            y: -65,
            z: z,
        };
        location.y += 1;
        return location;
    }

    const chunkLocation = { ...worldSpawn, y: 100 };
    if (dimension.isChunkLoaded(chunkLocation)) {
        teleportTargets(getHighestAirLocation(worldSpawn.x, worldSpawn.z));
        return;
    }

    const chunkLoadingPlayer = targets.find((target) => target instanceof Player);

    if (chunkLoadingPlayer) {
        let loopId: number = -1;

        chunkLoadingPlayer.teleport(worldSpawn, { dimension: dimension });

        function teleportWhenLoaded(): void {
            if (!dimension.isChunkLoaded(chunkLocation)) {
                return;
            }

            teleportTargets(getHighestAirLocation(worldSpawn.x, worldSpawn.z));
            system.clearRun(loopId);
        }

        loopId = system.runInterval(teleportWhenLoaded, 3);
        teleportWhenLoaded();
    } else {
        await loadArea(dimension, { ...worldSpawn, y: -64 }, { ...worldSpawn, y: 319 });
        teleportTargets(getHighestAirLocation(worldSpawn.x, worldSpawn.z));
    }
}
