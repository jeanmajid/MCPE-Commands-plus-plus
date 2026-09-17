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
    CustomCommandSource,
    CustomCommandStatus,
    Player,
    world,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
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
