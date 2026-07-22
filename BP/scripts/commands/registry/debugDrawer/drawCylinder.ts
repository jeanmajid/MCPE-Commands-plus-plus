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

import { DebugCylinder, debugDrawer } from "@minecraft/debug-utilities";
import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Vector3,
} from "@minecraft/server";

import { getNormalizedRgba } from "../../../utils/color.js";
import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "drawcylinder",
        description: "Draws a cylinder via the Debug Drawer module",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "startPos", type: CustomCommandParamType.Location },
            { name: "height", type: CustomCommandParamType.Float },
            { name: "radii", type: CustomCommandParamType.Float },
            { name: "scale", type: CustomCommandParamType.Float },
            { name: "numSegments", type: CustomCommandParamType.Integer }, // Optional?
            { name: "id", type: CustomCommandParamType.String },
        ],
        optionalParameters: [
            { name: "rotation", type: CustomCommandParamType.Location },
            { name: "colorRed", type: CustomCommandParamType.Integer },
            { name: "colorGreen", type: CustomCommandParamType.Integer },
            { name: "colorBlue", type: CustomCommandParamType.Integer },
            { name: "expirationSeconds", type: CustomCommandParamType.Float },
        ],
    },
    (
        origin,
        startPos: Vector3,
        endPos: Vector3,
        id: string,
        height: number,
        radii: number,
        scale: number,
        rotation: Vector3,
        colorRed: number,
        colorGreen: number,
        colorBlue: number,
        expirationTicks: number
    ) => {
        const cylinder = new DebugCylinder(startPos);

        if (colorBlue !== undefined) {
            cylinder.color = getNormalizedRgba(colorRed, colorGreen, colorBlue, 1);
        }

        if (expirationTicks) {
            cylinder.timeLeft = expirationTicks;
        }

        debugDrawer.addShape(cylinder);
        return { status: CustomCommandStatus.Success, message: "Cylinder successfully drawn" };
    }
);
