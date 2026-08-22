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


import { DebugLine } from "@minecraft/debug-utilities";
import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Vector3,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { DrawManager } from "../../managers/drawManager.js";

CommandManager.registerCommand(
    {
        name: "drawline",
        description: "Add a line",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "startPos", type: CustomCommandParamType.Location },
            { name: "endPos", type: CustomCommandParamType.Location },
            { name: "id", type: CustomCommandParamType.String },
        ],
    },
    (origin, startPos: Vector3, endPos: Vector3, id: string) => {
        const line = new DebugLine(startPos, endPos);
        DrawManager.addShape(id, line);

        return { status: CustomCommandStatus.Success, message: "Line successfully added" };
    }
);
