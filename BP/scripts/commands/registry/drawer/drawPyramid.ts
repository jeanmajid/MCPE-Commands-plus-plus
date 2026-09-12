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

CommandManager.registerCommand(
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
        return { status: CustomCommandStatus.Success, message: "Pyramid successfully drawn" };
    }
);
