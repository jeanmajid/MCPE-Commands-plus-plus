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
    Player,
} from "@minecraft/server";

import { NAMESPACE } from "../../../constants/namespace.js";
import { clamp } from "../../../utils/clamp.js";
import { CommandManager } from "../../command.js";

const COMMAND_HELP_WINDOW = 7;
const TOTAL_HELP_PAGES = Math.ceil(CommandManager.commands.length / COMMAND_HELP_WINDOW);

CommandManager.registerCommand(
    {
        name: "guide",
        aliases: ["listcommands"],
        description: "Lists in chat all new commands added by Commands++",
        permissionLevel: CommandPermissionLevel.Admin,
        optionalParameters: [{ name: "page", type: CustomCommandParamType.Integer }],
    },
    (origin, page: number = 1) => {
        if (!origin.sourceEntity || !(origin.sourceEntity instanceof Player)) {
            return;
        }

        page = clamp(page, 1, TOTAL_HELP_PAGES);

        const guideWindowStartIndex = (page - 1) * COMMAND_HELP_WINDOW;
        const guideWindowEndIndex = guideWindowStartIndex + COMMAND_HELP_WINDOW;

        let pageString = `§2--- Showing Commands++ help page ${page} of ${TOTAL_HELP_PAGES} (/guide <page>) ---§r`;

        for (let i = guideWindowStartIndex; i < guideWindowEndIndex; ++i) {
            const command = CommandManager.commands[i].data;
            pageString += `\n/${command.name.substring(NAMESPACE.length)} - ${command.description}`;
        }

        pageString +=
            "\n§2Tip: Use the <tab> key while typing a command to auto-complete the command or its arguments";

        (origin.sourceEntity as Player).sendMessage(pageString);
        return { status: CustomCommandStatus.Success };
    }
);
