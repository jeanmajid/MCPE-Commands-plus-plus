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
