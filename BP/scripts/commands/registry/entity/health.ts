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
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

export enum ValueUpdateMode {
    add = "add",
    remove = "remove",
    set = "set",
}

export const VALUE_UPDATE_MODE_ENUM_KEY = "valueUpdateMode";

CommandManager.registerEnum(VALUE_UPDATE_MODE_ENUM_KEY, Object.values(ValueUpdateMode));

CommandManager.registerCommand(
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
    (origin, targets: Entity[], valueUpdateMode: ValueUpdateMode, value: number) => {
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
            health.setCurrentValue(newValue);
        }

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully modified entity health",
        };
    }
);
