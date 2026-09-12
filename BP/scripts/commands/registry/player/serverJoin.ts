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
    system,
    Player,
} from "@minecraft/server";
import { transferPlayer } from "@minecraft/server-admin";

import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
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
    (origin, players: Player[], ip: string, port: number) => {
        if (players.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        for (const player of players) {
            system.run(() => {
                try {
                    transferPlayer(player, { hostname: ip, port: port });
                } catch {}
            });
        }

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully transfered player(s)",
        };
    }
);
