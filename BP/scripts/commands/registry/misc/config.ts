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
    CustomCommandParamType,
    CustomCommandStatus,
    world,
} from "@minecraft/server";

import { GAMERULE_KEY } from "../../../constants/dynamicPropertyKeys.js";
import { GameRuleManager } from "../../../gameRules/gameRule.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "config",
        description: "Get or set commands++ gamerules",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "gamerule", type: CustomCommandParamType.Enum, enumName: GAMERULE_KEY },
        ],
        optionalParameters: [{ name: "value", type: CustomCommandParamType.String }],
    },
    (_origin, gameRuleString: string, value?: string) => {
        const gameRule = GameRuleManager.get(gameRuleString);
        if (!gameRule) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Gamerule ${gameRuleString} does not exist`,
            };
        }

        if (value) {
            const valueType = typeof gameRule.value;
            const parsedValue = GameRuleManager.parseGameRuleValueString(value, valueType);
            if (parsedValue === null) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Failed to parse value of type " + valueType,
                };
            }

            if (parsedValue === gameRule.value) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: `Gamerule ${gameRule.id} already has the value ` + value,
                };
            }

            world.setDynamicProperty(`${GAMERULE_KEY}${gameRule.id}`, value);

            gameRule.value = parsedValue;
            gameRule.onValueUpdate();

            return {
                status: CustomCommandStatus.Success,
                message: `Set Gamerule ${gameRule.id} to ` + value,
            };
        } else {
            return {
                status: CustomCommandStatus.Success,
                message: `${gameRule.id}: ${gameRule.value}`,
            };
        }
    }
);
