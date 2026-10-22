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
    Vector3,
    world,
    system,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

const SUCCESS = { status: CustomCommandStatus.Success, message: "Successfully unvanished" };

CommandManager.register(
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
