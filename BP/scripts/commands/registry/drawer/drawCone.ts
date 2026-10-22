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

import { DebugCone } from "@minecraft/debug-utilities";
import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Vector3,
} from "@minecraft/server";

import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { CommandManager } from "../../command.js";
import { DrawManager } from "../../managers/drawManager.js";

CommandManager.register(
    {
        name: "drawcone",
        description: "Draws a cone via the Debug Drawer module",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "position", type: CustomCommandParamType.Location },
            { name: "height", type: CustomCommandParamType.Float },
            { name: "radii", type: CustomCommandParamType.Float },
            { name: "scale", type: CustomCommandParamType.Float },
        ],
    },
    (origin, id: string, position: Vector3, height: number, radii: number, scale: number) => {
        const dimension = getDimensionFromCommandOrigin(origin);

        const cone = new DebugCone({ ...position, dimension });
        cone.height = height;
        cone.radii = { x: radii, y: radii };
        cone.scale = scale;

        DrawManager.addShape(id, cone);
        return {
            status: CustomCommandStatus.Success,
            message: `Cone added to the drawing group "${id}"`,
        };
    }
);
