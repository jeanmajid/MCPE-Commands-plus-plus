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
    Player,
} from "@minecraft/server";

import { NAMESPACE } from "../../../constants/namespace.js";
import { clamp } from "../../../utils/math.js";
import { CommandManager } from "../../command.js";

const COMMAND_HELP_WINDOW = 7;
const TOTAL_HELP_PAGES = Math.ceil(CommandManager.commands.length / COMMAND_HELP_WINDOW);

const pageCache: string[] = [];

CommandManager.register(
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

        if (pageCache[page]) {
            (origin.sourceEntity as Player).sendMessage(pageCache[page]);
            return { status: CustomCommandStatus.Success };
        }

        const guideWindowStartIndex = (page - 1) * COMMAND_HELP_WINDOW;
        const guideWindowEndIndex = guideWindowStartIndex + COMMAND_HELP_WINDOW;

        let pageString = `§2--- Showing Commands++ help page ${page} of ${TOTAL_HELP_PAGES} (/guide <page>) ---§r`;

        for (let i = guideWindowStartIndex; i < guideWindowEndIndex; ++i) {
            const command = CommandManager.commands[i].data;
            pageString += `\n/${command.name.substring(NAMESPACE.length)} - ${command.description}`;
        }

        pageString +=
            "\n§2Tip: Use the <tab> key while typing a command to auto-complete the command or its arguments";

        pageCache[page] = pageString;
        (origin.sourceEntity as Player).sendMessage(pageString);
        return { status: CustomCommandStatus.Success };
    }
);
