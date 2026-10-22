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
