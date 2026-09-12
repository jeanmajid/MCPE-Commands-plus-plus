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

import { DebugText } from "@minecraft/debug-utilities";
import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Vector3,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "drawtext",
        description: "Draws a text via the Debug Drawer module",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "location", type: CustomCommandParamType.Location },
            { name: "text", type: CustomCommandParamType.String },
            { name: "useRotation", type: CustomCommandParamType.Boolean },
            { name: "showThroughBlocks", type: CustomCommandParamType.Boolean },
            { name: "backfaceVisible", type: CustomCommandParamType.Boolean },
            { name: "textBackfaceVisible", type: CustomCommandParamType.Boolean },
        ],
    },
    (
        _,
        id: string,
        location: Vector3,
        text: string,
        useRotation: boolean,
        showThroughBlocks: boolean,
        backfaceVisible: boolean,
        textBackfaceVisible: boolean
    ) => {
        const textShape = new DebugText(location, text);
        textShape.useRotation = useRotation;
        textShape.backfaceVisible = !showThroughBlocks;
        textShape.backfaceVisible = backfaceVisible;
        textShape.textBackfaceVisible = textBackfaceVisible;

        return { status: CustomCommandStatus.Success, message: `Text shape ${id} registered` };
    }
);
