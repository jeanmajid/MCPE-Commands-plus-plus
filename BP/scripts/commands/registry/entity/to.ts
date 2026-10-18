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

CommandManager.register(
    {
        name: "to",
        description: "Teleports the target to the block they are facing at",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [{ name: "targets", type: CustomCommandParamType.EntitySelector }],
    },
    (origin, targets: Entity[]) => {
        if (!targets) {
            if (!origin.sourceEntity) {
                return { status: CustomCommandStatus.Failure, message: "No targets provided" };
            }

            system.run(() => {
                tpToBlockFromViewDirection(origin.sourceEntity);
            });
            return SUCCESS_RESULT;
        } else if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            for (const target of targets) {
                tpToBlockFromViewDirection(target);
            }
        });
        return SUCCESS_RESULT;
    }
);

export function tpToBlockFromViewDirection(target: Entity | undefined): undefined {
    if (!target || !target.isValid) {
        return;
    }

    const intersection = target.getBlockFromViewDirection();
    if (!intersection) {
        return;
    }

    const { face, faceLocation, block } = intersection;
    const blockLocation = Vector.add(faceLocation, block.location);
    const destination = Vector.add(blockLocation, DirectionOffset[face]);
    target.teleport(destination);
}
