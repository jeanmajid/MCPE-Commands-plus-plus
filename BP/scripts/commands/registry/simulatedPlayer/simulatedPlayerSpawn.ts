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
    Vector3,
    GameMode,
    system,
} from "@minecraft/server";
import { spawnSimulatedPlayer } from "@minecraft/server-gametest";

import { GAME_MODE_ALIASED_ENUM_KEY } from "../../../enums/registry/gameModes.js";
import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { generateRandomUsername } from "../../../utils/usernameGenerator.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "simulatedplayerspawn",
        aliases: ["simspawn"],
        description: "Spawns a simulated player",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { name: "location", type: CustomCommandParamType.Location },
            {
                name: "gamemode",
                type: CustomCommandParamType.Enum,
                enumName: GAME_MODE_ALIASED_ENUM_KEY,
            },
            { name: "name", type: CustomCommandParamType.String },
        ],
    },
    (
        origin,
        location: Vector3,
        gamemode: GameMode = GameMode.Survival,
        name: string = generateRandomUsername()
    ) => {
        if (!location) {
            const source = origin.sourceEntity ?? origin.sourceBlock ?? origin.initiator;
            if (!source) {
                return { status: CustomCommandStatus.Failure, message: "No location provided" };
            }

            location = source.location;
        }

        const dimension = getDimensionFromCommandOrigin(origin);
        system.run(() => {
            spawnSimulatedPlayer({ ...location, dimension: dimension }, name, gamemode);
        });
        return { status: CustomCommandStatus.Success, message: "Spawned simulated player" };
    }
);
