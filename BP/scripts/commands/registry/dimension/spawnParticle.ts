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
    CustomCommandParamType,
    CustomCommandStatus,
    system,
    Vector3,
} from "@minecraft/server";

import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "spawnparticle",
        description: "Spawns particles at the location which parameters",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "identifier", type: CustomCommandParamType.String },
            { name: "location", type: CustomCommandParamType.Location },
        ],
        optionalParameters: [
            { name: "count", type: CustomCommandParamType.Integer },
            { name: "radius", type: CustomCommandParamType.Float },
        ],
    },
    (origin, identifier: string, location: Vector3, count: number = 1) => {
        // TODO add simulation validation to location
        // TODO add count and range validation
        // TODO add expression parameter which parses some expression like molang
        // TODO implement the radius shit
        system.run(() => {
            const dimension = getDimensionFromCommandOrigin(origin);

            for (let i = 0; i < count; ++i) {
                dimension.spawnParticle(identifier, location);
            }
        });

        return { status: CustomCommandStatus.Success, message: "Sent particle request to client" };
    }
);
