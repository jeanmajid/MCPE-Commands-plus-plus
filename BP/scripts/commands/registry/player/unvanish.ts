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
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "unvanish",
        description:
            "Go out of spectator mode and optionally return to original position when exiting",
        aliases: ["uv"],
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { name: "player", type: CustomCommandParamType.PlayerSelector },
            { name: "tpBack", type: CustomCommandParamType.Boolean },
        ],
    },
    (origin, player: Player[], tpBack: boolean) => {
        const source = origin.sourceEntity;
        if (!player && source instanceof Player) {
            unvanishPlayer(source, tpBack);
        }

        for (const target of player) {
            unvanishPlayer(target, tpBack);
        }

        return { status: CustomCommandStatus.Success };
    }
);

function unvanishPlayer(player: Player, tpBack: boolean): void {
    if (!player.vanishMode) {
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

        player.teleport(location, { dimension: world.getDimension(dimensionId) });
    }

    player.setGameMode(dataParsed.gameMode);
}
