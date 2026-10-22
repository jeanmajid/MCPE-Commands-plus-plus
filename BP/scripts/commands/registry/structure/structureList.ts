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
    Player,
    CustomCommandStatus,
    world,
    system,
    CustomCommandResult,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "structurelist",
        description: "list all the structures on the world",
        permissionLevel: CommandPermissionLevel.Admin,
    },
    (origin) => {
        system.run((): CustomCommandResult => {
            if (!(origin.sourceEntity instanceof Player)) {
                return { status: CustomCommandStatus.Failure };
            }

            const structureIds = world.structureManager.getWorldStructureIds();
            const message =
                structureIds.length > 0
                    ? `§aStructures in world:\n§7${structureIds.join("\n§7")}`
                    : "§cNo structures found in world";
            origin.sourceEntity.sendMessage(message);

            return { status: CustomCommandStatus.Success };
        });
        return { status: CustomCommandStatus.Success };
    }
);
