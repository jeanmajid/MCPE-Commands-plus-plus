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

import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "top",
        description: "Teleports the target to the top most block at their position",
        permissionLevel: CommandPermissionLevel.GameDirectors,

        optionalParameters: [
            { name: "target", type: CustomCommandParamType.EntitySelector },
            { name: "minHeight", type: CustomCommandParamType.Float },
        ],
    },
    (origin, target: Entity[], minHeight?: number) => {
        system.run(() => {
            if (!target && origin.sourceEntity) {
                teleportEntityToTop(origin.sourceEntity, minHeight);
                return;
            }
            for (const entity of target) {
                teleportEntityToTop(entity, minHeight);
            }
        });
        return { status: CustomCommandStatus.Success, message: "Sucessfully teleported entities" };
    }
);

function teleportEntityToTop(entity: Entity, minHeight?: number): void {
    const { x, y, z } = entity.location;
    const topBlock = entity.dimension.getTopmostBlock({ x, z }, minHeight);
    if (!topBlock || topBlock.y <= y) {
        return;
    }
    entity.teleport({ x, y: topBlock.y + 1, z });
}
