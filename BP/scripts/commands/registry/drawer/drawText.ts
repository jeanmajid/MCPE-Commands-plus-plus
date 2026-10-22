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

import { DebugText } from "@minecraft/debug-utilities";
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
        origin,
        id: string,
        location: Vector3,
        text: string,
        useRotation: boolean,
        showThroughBlocks: boolean,
        backfaceVisible: boolean,
        textBackfaceVisible: boolean
    ) => {
        const dimension = getDimensionFromCommandOrigin(origin);

        const textShape = new DebugText({ ...location, dimension }, text);
        textShape.useRotation = !useRotation;
        textShape.backfaceVisible = !showThroughBlocks;
        textShape.backfaceVisible = backfaceVisible;
        textShape.textBackfaceVisible = textBackfaceVisible;

        DrawManager.addShape(id, textShape);

        return {
            status: CustomCommandStatus.Success,
            message: `Text added to the drawing group "${id}"`,
        };
    }
);
