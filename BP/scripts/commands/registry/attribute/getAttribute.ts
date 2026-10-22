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

import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    world,
    system,
} from "@minecraft/server";

import { AttributeManager } from "../../../attributes/attribute.js";
import { ATTRIBUTE_KEY } from "../../../constants/dynamicPropertyKeys.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "getattribute",
        description: "One time getter for attributes",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "bindtype", type: CustomCommandParamType.Enum, enumName: ATTRIBUTE_KEY },
            { name: "scoreboardId", type: CustomCommandParamType.String },
        ],
    },
    (origin, attributeId: string, scoreboardId: string) => {
        const attribute = AttributeManager.get(attributeId);
        if (!attribute) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} does not exist`,
            };
        }

        system.run(() => {
            const score =
                world.scoreboard.getObjective(scoreboardId) ??
                world.scoreboard.addObjective(scoreboardId);

            attribute.setValues(score);
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Successfully binded ${attributeId} to score ${scoreboardId}`,
        };
    }
);
