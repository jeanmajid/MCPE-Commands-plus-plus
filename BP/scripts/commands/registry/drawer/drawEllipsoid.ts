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

import { DebugEllipsoid } from "@minecraft/debug-utilities";
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
        name: "drawellipsoid", // please change da faking name or smt
        description: "Draws a ellipsoid via the Debug Drawer module",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "position", type: CustomCommandParamType.Location },
            { name: "radii", type: CustomCommandParamType.Float },
            { name: "scale", type: CustomCommandParamType.Float },
            { name: "segmentsPerAxis", type: CustomCommandParamType.Integer }, // Optional?
        ],
    },
    (
        origin,
        id: string,
        position: Vector3,
        radii: number,
        scale: number,
        segmentsPerAxis: number
    ) => {
        const dimension = getDimensionFromCommandOrigin(origin);

        const ellipsoid = new DebugEllipsoid({ ...position, dimension });
        ellipsoid.radii = { x: radii, y: radii, z: radii };
        ellipsoid.scale = scale;
        ellipsoid.segmentsPerAxis = segmentsPerAxis;

        DrawManager.addShape(id, ellipsoid);
        return {
            status: CustomCommandStatus.Success,
            message: `Ellipsoid added to the drawing group "${id}"`,
        };
    }
);
