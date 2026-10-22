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
