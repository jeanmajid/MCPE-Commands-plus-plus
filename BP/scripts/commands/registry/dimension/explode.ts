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
    Entity,
    system,
    Vector3,
} from "@minecraft/server";

import { clamp } from "../../../utils/clamp.js";
import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "explode",
        description: "Creates an explosion at the target position with the provided parameters",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "location", type: CustomCommandParamType.Location }],
        optionalParameters: [
            { name: "radius", type: CustomCommandParamType.Float },
            { name: "breaksBlocks", type: CustomCommandParamType.Boolean },
            { name: "causesFire", type: CustomCommandParamType.Boolean },
            { name: "allowUnderwater", type: CustomCommandParamType.Boolean },
            { name: "explosionSource", type: CustomCommandParamType.EntitySelector },
        ],
    },
    (
        origin,
        location: Vector3,
        radius: number = 5,
        breaksBlocks: boolean = true,
        causesFire: boolean = false,
        allowUnderwater: boolean = false,
        explosionSource: Entity[] = []
    ) => {
        const source = origin.sourceEntity ?? origin.sourceBlock ?? origin.initiator;
        const dimension = source?.dimension;
        radius = clamp(radius, 1, 1000);

        system.run(() => {
            try {
                dimension?.createExplosion(location, radius, {
                    breaksBlocks: breaksBlocks,
                    causesFire: causesFire,
                    allowUnderwater: allowUnderwater,
                    source: explosionSource[0],
                });
            } catch {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Cannot create explosion outside of the world",
                };
            }
        });
        return { status: CustomCommandStatus.Success, message: `Successfully created explosion` };
    }
);
