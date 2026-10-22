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

import { clamp } from "../../../utils/math.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "heal",
        description: "Heals the target by a value",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { name: "target", type: CustomCommandParamType.PlayerSelector },
            { name: "value", type: CustomCommandParamType.Integer },
        ],
    },
    (origin, targets: Entity[], amount: number) => {
        if (!targets) {
            if (!origin.sourceEntity) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Cannot heal invalid target",
                };
            }
            targets = [origin.sourceEntity];
        } else if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        for (const target of targets) {
            const health = target.getComponent("minecraft:health");

            if (!health) {
                continue;
            }

            system.run(() => {
                if (amount !== undefined) {
                    const newValue = clamp(health.currentValue + amount, 0, health.effectiveMax);
                    health.setCurrentValue(newValue);
                } else {
                    health.setCurrentValue(health.effectiveMax);
                }
            });
        }
        return { status: CustomCommandStatus.Success, message: "Successfully healed entities" };
    }
);
