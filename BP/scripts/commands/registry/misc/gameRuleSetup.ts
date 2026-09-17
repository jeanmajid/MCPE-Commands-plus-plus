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
    Player,
    system,
    world,
} from "@minecraft/server";

import { OPTIMISED_GAMERULE_SETUP } from "../../../constants/optimisedGameRules.js";
import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "gamerulesetup",
        description: "Sets most gamerules to game-ready optimised values",
        permissionLevel: CommandPermissionLevel.GameDirectors,
    },
    (origin) => {
        let changes = "";
        system.run(() => {
            for (const gamerule of OPTIMISED_GAMERULE_SETUP) {
                const gameruleValue = world.gameRules[gamerule.rule];
                if (gameruleValue !== gamerule.value) {
                    // @ts-expect-error
                    world.gameRules[gamerule.rule] = gamerule.value;
                    changes += `${gamerule.rule} ${gameruleValue} -> ${gamerule.value}\n`;
                }
            }

            if (origin.sourceEntity instanceof Player) {
                changes +=
                    "\n§2Tip: To re-enable command feedback use (/gamerule sendcommandfeedback true)";

                for (const player of world.getAllPlayers()) {
                    if (player.commandPermissionLevel >= CommandPermissionLevel.Admin) {
                        player.sendMessage(changes);
                    }
                }
            }
        });

        return { status: CustomCommandStatus.Success };
    }
);
