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
import { kickPlayer } from "@minecraft/server-admin";

import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "masskick",
        description: "Kicks players from the world supporting selectors",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "players", type: CustomCommandParamType.PlayerSelector }],
        optionalParameters: [{ name: "reason", type: CustomCommandParamType.String }],
    },
    (origin, players: Player[], reason: string) => {
        if (players.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        for (const player of players) {
            try {
                kickPlayer(player, reason);
            } catch {}
        }

        return { status: CustomCommandStatus.Success, message: "Successfully kicked player(s)" };
    }
);
