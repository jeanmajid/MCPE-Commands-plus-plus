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


import { CommandPermissionLevel, CustomCommandStatus, Player } from "@minecraft/server";

import { CREDITS } from "../../../constants/credits.js";
import { CommandManager } from "../../command.js";

let creditsString = "";

CommandManager.registerCommand(
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
