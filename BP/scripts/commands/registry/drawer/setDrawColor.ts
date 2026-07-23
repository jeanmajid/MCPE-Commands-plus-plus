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
    CustomCommandStatus,
    CustomCommandParamType,
} from "@minecraft/server";

import { getNormalizedRgba } from "../../../utils/color.js";
import { CommandManager } from "../../command.js";
import { DrawerManager } from "../../managers/drawerManger.js";

CommandManager.registerCommand(
    {
        name: "setdrawcolor",
        description: "Sets the draw color",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "shapeId", type: CustomCommandParamType.String },
            { name: "colorRed", type: CustomCommandParamType.Integer },
            { name: "colorGreen", type: CustomCommandParamType.Integer },
            { name: "colorBlue", type: CustomCommandParamType.Integer },
        ],
    },
    (origin, shapeId, colorRed: number, colorGreen: number, colorBlue: number) => {
        DrawerManager.setProperty(
            shapeId,
            "color",
            getNormalizedRgba(colorRed, colorGreen, colorBlue, 1)
        );

        return { status: CustomCommandStatus.Success, message: "Box color successfully set" };
    }
);
