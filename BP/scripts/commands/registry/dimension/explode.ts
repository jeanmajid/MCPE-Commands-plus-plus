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
    CustomCommandResult,
    CustomCommandStatus,
    Entity,
    system,
    Vector3,
} from "@minecraft/server";

import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { clamp } from "../../../utils/math.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
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
        const dimension = getDimensionFromCommandOrigin(origin);
        radius = clamp(radius, 1, 1000);

        system.run((): CustomCommandResult => {
            try {
                dimension?.createExplosion(location, radius, {
                    breaksBlocks: breaksBlocks,
                    causesFire: causesFire,
                    allowUnderwater: allowUnderwater,
                    source: explosionSource[0],
                });
                return { status: CustomCommandStatus.Success };
            } catch {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Cannot create explosion outside of the world",
                };
            }
        });
        return { status: CustomCommandStatus.Success, message: "Successfully created explosion" };
    }
);
