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
