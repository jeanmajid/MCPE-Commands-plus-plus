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
    Player,
    system,
    world,
} from "@minecraft/server";

import { OPTIMISED_GAMERULE_SETUP } from "../../../constants/optimisedGameRules.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
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
