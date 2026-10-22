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

import { DebugArrow } from "@minecraft/debug-utilities";
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
        name: "drawarrow",
        description: "Draws a arrow via the Debug Drawer module",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "id", type: CustomCommandParamType.String },
            { name: "startPos", type: CustomCommandParamType.Location },
            { name: "endPos", type: CustomCommandParamType.Location },
            { name: "headLength", type: CustomCommandParamType.Float },
            { name: "headRadius", type: CustomCommandParamType.Float },
            { name: "headSegments", type: CustomCommandParamType.Integer },
        ],
    },
    (
        origin,
        id: string,
        startPos: Vector3,
        endPos: Vector3,
        headLength: number,
        headRadius: number,
        headSegments: number
    ) => {
        const dimension = getDimensionFromCommandOrigin(origin);

        const arrow = new DebugArrow({ ...startPos, dimension }, endPos);
        arrow.headLength = headLength;
        arrow.headRadius = headRadius;
        arrow.headSegments = headSegments;

        DrawManager.addShape(id, arrow);
        return {
            status: CustomCommandStatus.Success,
            message: `Arrow added to the drawing group "${id}"`,
        };
    }
);
