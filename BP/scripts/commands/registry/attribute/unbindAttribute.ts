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
        name: "unbindattribute",
        description: "Unbind an attribute",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "bindtype", type: CustomCommandParamType.Enum, enumName: ATTRIBUTE_KEY },
        ],
    },
    (origin, attributeId: string) => {
        const attribute = AttributeManager.get(attributeId);
        if (!attribute) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} does not exist`,
            };
        }
        if (!attribute.isBinded) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} isn't binded`,
            };
        }

        system.run(() => {
            world.setDynamicProperty(`${ATTRIBUTE_KEY}${attributeId}`, undefined);
            attribute.cleanup();
            world.scoreboard.removeObjective(attribute.score);

            attribute.isBinded = false;
            // @ts-expect-error
            attribute.score = undefined;
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Successfully unbinded ${attributeId}`,
        };
    }
);
