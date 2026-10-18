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

import { DirectionOffset } from "../../../constants/directionOffset.js";
import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";

const SUCCESS_RESULT = {
    status: CustomCommandStatus.Success,
    message: "Sucessfully teleported entities",
};
const MAX_DISTANCE = 32;

CommandManager.register(
    {
        name: "thru",
        aliases: ["phase"],
        description: "Teleports the target through the block they are facing at, up to 16 blocks",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [{ name: "targets", type: CustomCommandParamType.EntitySelector }],
    },
    (origin, targets?: Entity[]) => {
        if (!targets) {
            if (!origin.sourceEntity) {
                return { status: CustomCommandStatus.Failure, message: "No targets provided" };
            }

            system.run(() => {
                tpThroughBlockFromViewDirection(origin.sourceEntity);
            });
            return SUCCESS_RESULT;
        } else if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            for (const target of targets) {
                tpThroughBlockFromViewDirection(target);
            }
        });
        return SUCCESS_RESULT;
    }
);

export function tpThroughBlockFromViewDirection(target: Entity | undefined): undefined {
    if (!target || !target.isValid) {
        return;
    }

    const intersection = target.getBlockFromViewDirection({ maxDistance: MAX_DISTANCE });
    if (!intersection) {
        return;
    }

    const dimension = target.dimension;
    const headLocation = target.getHeadLocation();
    const hitLocation = Vector.add(intersection.faceLocation, intersection.block.location);
    const direction = target.getViewDirection();
    const distanceToHit = Vector.distance(headLocation, hitLocation);
    const remainingDistance = MAX_DISTANCE - distanceToHit;
    const headOffset = Vector.subtract(headLocation, target.location);

    for (let distance = 1; distance <= remainingDistance; ++distance) {
        const feetPosition = Vector.subtract(
            Vector.locationInfront(hitLocation, direction, distance),
            headOffset
        );
        const feetBlockLocation = Vector.floor(feetPosition);
        const feetBlock = dimension.getBlock(feetBlockLocation);
        const headBlock = dimension.getBlock(Vector.add(feetBlockLocation, DirectionOffset.Up));

        if (feetBlock && headBlock && feetBlock.isAir && headBlock.isAir) {
            target.tryTeleport({
                x: feetBlockLocation.x + 0.5,
                y: feetBlockLocation.y,
                z: feetBlockLocation.z + 0.5,
            });
            return;
        }
    }
}
