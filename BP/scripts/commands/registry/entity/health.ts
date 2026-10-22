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
    Entity,
    system,
} from "@minecraft/server";

import {
    VALUE_UPDATE_MODE_ENUM_KEY,
    ValueUpdateMode,
} from "../../../enums/registry/valueUpdateMode.js";
import { clamp } from "../../../utils/math.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "health",
        description: "Modifies all targets health based on the mode and value",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "target", type: CustomCommandParamType.PlayerSelector },
            {
                name: "mode",
                type: CustomCommandParamType.Enum,
                enumName: VALUE_UPDATE_MODE_ENUM_KEY,
            },
            { name: "value", type: CustomCommandParamType.Integer },
        ],
    },
    (_, targets: Entity[], valueUpdateMode: ValueUpdateMode, value: number) => {
        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        for (const target of targets) {
            const health = target.getComponent("minecraft:health");

            if (!health) {
                continue;
            }

            let newValue = 0;
            switch (valueUpdateMode) {
                case ValueUpdateMode.add:
                    newValue = health.currentValue + value;
                    break;
                case ValueUpdateMode.remove:
                    newValue = health.currentValue - value;
                    break;
                case ValueUpdateMode.set:
                    newValue = value;
            }
            newValue = clamp(newValue, 0, health.effectiveMax);
            system.run(() => {
                health.setCurrentValue(newValue);
            });
        }

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully modified entity health",
        };
    }
);
