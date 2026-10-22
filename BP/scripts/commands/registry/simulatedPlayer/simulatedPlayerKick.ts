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
    Entity,
} from "@minecraft/server";
import { SimulatedPlayer } from "@minecraft/server-gametest";

import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "simulatedplayerkick",
        aliases: ["simkick"],
        description: "Disconnects a simulated player from the world",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [{ name: "players", type: CustomCommandParamType.EntitySelector }],
    },
    (origin, players: Entity[]) => {
        system.run(() => {
            for (const player of players) {
                if (!(player instanceof SimulatedPlayer)) {
                    continue;
                }
                player.disconnect();
            }
        });
        return {
            status: CustomCommandStatus.Success,
            message: "Disconnected the simulated player from the world",
        };
    }
);
