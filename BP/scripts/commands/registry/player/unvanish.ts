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
    Vector3,
    world,
    system,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

const SUCCESS = { status: CustomCommandStatus.Success, message: "Successfully unvanished" };

CommandManager.registerCommand(
    {
        name: "unvanish",
        description: "Exits vanish mode and optionally returns to original position",
        aliases: ["uv"],
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { name: "players", type: CustomCommandParamType.PlayerSelector },
            { name: "tpBack", type: CustomCommandParamType.Boolean },
        ],
    },
    (origin, players: Player[], tpBack: boolean) => {
        const source = origin.sourceEntity;
        if (!players) {
            if (source instanceof Player) {
                unvanishPlayer(source, tpBack);
                return SUCCESS;
            }
            return { status: CustomCommandStatus.Failure, message: "Invalid target" };
        }

        if (players.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        for (const player of players) {
            unvanishPlayer(player, tpBack);
        }

        return SUCCESS;
    }
);

function unvanishPlayer(player: Player, tpBack: boolean): void {
    if (!player.getDynamicProperty("vanishMode")) {
        return;
    }

    const data = player.getDynamicProperty("vanishLocation") as string;
    if (!data) {
        return;
    }
    const dataParsed = JSON.parse(data);

    if (tpBack) {
        const location: Vector3 = dataParsed.location;
        const dimensionId: string = dataParsed.dimension;

        system.run(() => {
            player.teleport(location, { dimension: world.getDimension(dimensionId) });
        });
    }
    system.run(() => {
        player.setGameMode(dataParsed.gameMode);
    });

    player.setDynamicProperty("vanishMode", undefined);
}
