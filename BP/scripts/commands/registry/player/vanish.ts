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
    GameMode,
    system,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

const SUCCESS = { status: CustomCommandStatus.Success, message: "Successfully vanished player" };

CommandManager.register(
    {
        name: "vanish",
        description: "Enter vanish mode and optionally return to original position when exiting",
        aliases: ["v"],
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [{ name: "players", type: CustomCommandParamType.PlayerSelector }],
    },
    (origin, players: Player[]) => {
        const source = origin.sourceEntity;
        if (!players) {
            if (source instanceof Player) {
                vanishPlayer(source);
                return SUCCESS;
            }
            return { status: CustomCommandStatus.Failure, message: "Invalid target" };
        }

        if (players.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        for (const target of players) {
            vanishPlayer(target);
        }

        return SUCCESS;
    }
);

function vanishPlayer(player: Player): void {
    if (player.getDynamicProperty("vanishMode")) {
        return;
    }

    system.run(() => {
        player.setGameMode(GameMode.Spectator);
    });
    player.setDynamicProperty(
        "vanishLocation",
        JSON.stringify({
            location: player.location,
            dimension: player.dimension.id,
            gameMode: player.getGameMode(),
        })
    );

    player.setDynamicProperty("vanishMode", true);
}
