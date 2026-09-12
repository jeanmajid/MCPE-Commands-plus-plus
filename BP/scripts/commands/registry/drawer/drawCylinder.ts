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

import { DebugCylinder } from "@minecraft/debug-utilities";
import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Vector3,
} from "@minecraft/server";

import { clamp } from "../../../utils/clamp.js";
import { CommandManager } from "../../command.js";
import { DrawManager } from "../../managers/drawManager.js";

CommandManager.registerCommand(
    {
        name: "drawcylinder",
        description: "Draws a cylinder via the Debug Drawer module",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "position", type: CustomCommandParamType.Location },
            { name: "height", type: CustomCommandParamType.Float },
            { name: "radiiBottom", type: CustomCommandParamType.Float },
            { name: "radiiTop", type: CustomCommandParamType.Float },
            { name: "scale", type: CustomCommandParamType.Float },
            { name: "numSegments", type: CustomCommandParamType.Integer }, // Optional?
        ],
    },
    (
        _,
        id: string,
        position: Vector3,
        height: number,
        radiiBottom: number,
        radiiTop: number,
        scale: number,
        numSegments: number
    ) => {
        const cylinder = new DebugCylinder(position);
        cylinder.height = height;
        cylinder.radii = { x: radiiBottom, y: radiiTop };
        cylinder.scale = scale;
        cylinder.numSegments = clamp(numSegments, 3, 128);

        DrawManager.addShape(id, cylinder);
        return { status: CustomCommandStatus.Success, message: "Cylinder successfully drawn" };
    }
);
