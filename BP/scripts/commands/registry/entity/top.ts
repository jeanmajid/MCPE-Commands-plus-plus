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

import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "top",
        description: "Teleports the targets to the top most block at their position",
        permissionLevel: CommandPermissionLevel.GameDirectors,

        optionalParameters: [
            { name: "targets", type: CustomCommandParamType.EntitySelector },
            { name: "minHeight", type: CustomCommandParamType.Float },
        ],
    },
    (origin, targets: Entity[], minHeight?: number) => {
        if (!targets && origin.sourceEntity) {
            system.run(() => {
                if (origin.sourceEntity?.isValid) {
                    teleportEntityToTop(origin.sourceEntity, minHeight);
                }
            });
            return {
                status: CustomCommandStatus.Success,
                message: "Sucessfully teleported entities",
            };
        }

        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            for (const target of targets) {
                teleportEntityToTop(target, minHeight);
            }
        });

        return { status: CustomCommandStatus.Success, message: "Sucessfully teleported entities" };
    }
);

function teleportEntityToTop(target: Entity, minHeight?: number): void {
    const { x, y, z } = target.location;
    const topBlock = target.dimension.getTopmostBlock({ x, z }, minHeight);
    if (!topBlock || topBlock.y <= y) {
        return;
    }
    target.teleport({ x, y: topBlock.y + 1, z });
}
