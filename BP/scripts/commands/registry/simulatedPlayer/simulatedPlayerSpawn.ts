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
