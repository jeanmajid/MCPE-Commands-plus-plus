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

import { DebugBox } from "@minecraft/debug-utilities";
import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Vector3,
} from "@minecraft/server";

import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";
import { DrawManager } from "../../managers/drawManager.js";

CommandManager.registerCommand(
    {
        name: "drawvolume",
        description: "Draws a box via the Debug Drawer module",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "startPos", type: CustomCommandParamType.Location },
            { name: "endPos", type: CustomCommandParamType.Location },
        ],
    },
    (origin, id: string, from: Vector3, to: Vector3) => {
        const dimension = getDimensionFromCommandOrigin(origin);

        Vector.setSmallestAndBiggest(from, to);

        const bound = Vector.subtract(to, from);
        bound.x += 1;
        bound.y += 1;
        bound.z += 1;

        from.x += bound.x / 2;
        from.y += bound.y / 2;
        from.z += bound.z / 2;

        const box = new DebugBox({ ...from, dimension });
        box.bound = bound;

        DrawManager.addShape(id, box);
        return { status: CustomCommandStatus.Success, message: "Box successfully drawn" };
    }
);
