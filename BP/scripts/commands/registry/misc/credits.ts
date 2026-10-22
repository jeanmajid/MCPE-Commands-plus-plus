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

import { CommandPermissionLevel, CustomCommandStatus, Player } from "@minecraft/server";

import { CREDITS } from "../../../constants/credits.js";
import { CommandManager } from "../../command.js";

let creditsString = "";

CommandManager.register(
    {
        name: "credits",
        description: "Provides an output message in chat containing the credits for Commands++",
        permissionLevel: CommandPermissionLevel.Any,
    },
    (origin) => {
        if (!origin.sourceEntity || !(origin.sourceEntity instanceof Player)) {
            return { status: CustomCommandStatus.Failure };
        }

        if (!creditsString) {
            creditsString +=
                "\n§aThis world is powered by Commands++\n§b(https://github.com/jeanmajid/MCPE-Commands-plus-plus)§r";

            for (const role of CREDITS) {
                if (role.names.length === 0) {
                    continue;
                }
                creditsString += `\n \n§l§7${role.role.toUpperCase()}`; // Could be faster with joining but that would look ass
                for (const name of role.names) {
                    creditsString += `\n§l §r${name}`;
                }
            }

            creditsString += "\n ";
        }

        (origin.sourceEntity as Player).sendMessage(creditsString);

        return { status: CustomCommandStatus.Success };
    }
);
