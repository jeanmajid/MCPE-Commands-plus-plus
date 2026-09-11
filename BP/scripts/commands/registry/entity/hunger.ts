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
import { VALUE_UPDATE_MODE_ENUM_KEY, ValueUpdateMode } from "./health.js";

CommandManager.registerCommand(
    {
        name: "hunger",
        description: "Modifies all target players' hunger based on the mode and value",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "players", type: CustomCommandParamType.PlayerSelector },
            {
                name: "mode",
                type: CustomCommandParamType.Enum,
                enumName: VALUE_UPDATE_MODE_ENUM_KEY,
            },
            { name: "value", type: CustomCommandParamType.Integer },
        ],
    },
    (origin, players: Entity[], valueUpdateMode: ValueUpdateMode, value: number) => {
        if (players.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        for (const player of players) {
            const hunger = player.getComponent("player.hunger");

            if (!hunger) {
                continue;
            }

            let newValue = 0;
            switch (valueUpdateMode) {
                case ValueUpdateMode.add:
                    newValue = hunger.currentValue + value;
                    break;
                case ValueUpdateMode.remove:
                    newValue = hunger.currentValue - value;
                    break;
                case ValueUpdateMode.set:
                    newValue = value;
            }
            hunger.setCurrentValue(newValue);
        }

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully modified player hunger",
        };
    }
);
