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

import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Entity,
    system,
} from "@minecraft/server";

import { clamp } from "../../../utils/clamp.js";
import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
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
