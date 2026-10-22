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
    CustomCommandSource,
    CustomCommandStatus,
    Player,
    world,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "seed",
        description: "Returns a message to the executor containing the world seed",
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    (origin) => {
        const outputMessage = `§aSeed: §r${world.seed}`;

        if (origin.sourceEntity instanceof Player) {
            origin.sourceEntity.sendMessage(outputMessage);
            return { status: CustomCommandStatus.Success };
        }

        if (
            origin.sourceType === CustomCommandSource.NPCDialogue &&
            origin.initiator instanceof Player
        ) {
            origin.initiator.sendMessage(outputMessage);
            return { status: CustomCommandStatus.Success };
        }

        return { status: CustomCommandStatus.Success, message: outputMessage };
    }
);
