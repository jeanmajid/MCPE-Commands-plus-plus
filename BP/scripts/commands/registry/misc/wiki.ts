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

import { WIKI_LINK } from "../../../constants/wiki.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "wiki",
        description: "Provides a link in chat to the wiki page of Commands++",
        permissionLevel: CommandPermissionLevel.Admin,
    },
    (origin) => {
        if (!origin.sourceEntity || !(origin.sourceEntity instanceof Player)) {
            return { status: CustomCommandStatus.Failure };
        }

        (origin.sourceEntity as Player).sendMessage(WIKI_LINK);
        return { status: CustomCommandStatus.Success };
    }
);
