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

import { DebugPyramid } from "@minecraft/debug-utilities";
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
        name: "drawpyramid",
        description: "Draws a pyramid via the Debug Drawer module",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "position", type: CustomCommandParamType.Location },
            { name: "height", type: CustomCommandParamType.Float },
            { name: "width", type: CustomCommandParamType.Float },
            { name: "depth", type: CustomCommandParamType.Float },
            { name: "scale", type: CustomCommandParamType.Float },
        ],
    },
    (
        origin,
        id: string,
        position: Vector3,
        height: number,
        width: number,
        depth: number,
        scale: number
    ) => {
        const dimension = getDimensionFromCommandOrigin(origin);

        const pyramid = new DebugPyramid({ ...position, dimension });
        pyramid.height = height;
        pyramid.width = width;
        pyramid.depth = depth;
        pyramid.scale = scale;

        DrawManager.addShape(id, pyramid);
        return {
            status: CustomCommandStatus.Success,
            message: `Pyramid added to the drawing group "${id}"`,
        };
    }
);
