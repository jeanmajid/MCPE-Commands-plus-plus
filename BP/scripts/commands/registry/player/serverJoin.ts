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
    system,
    Player,
} from "@minecraft/server";
import { transferPlayer } from "@minecraft/server-admin";

import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "serverjoin",
        description: "Transfers players to a server",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "players", type: CustomCommandParamType.PlayerSelector },
            { name: "ip", type: CustomCommandParamType.String },
            { name: "port", type: CustomCommandParamType.Integer },
        ],
    },
    (_, players: Player[], ip: string, port: number) => {
        if (players.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector " };
        }

        system.run(() => {
            for (const player of players) {
                try {
                    transferPlayer(player, { hostname: ip, port: port });
                } catch {}
            }
        });

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully transfered player(s)",
        };
    }
);
