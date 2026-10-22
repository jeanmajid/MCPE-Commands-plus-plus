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

import { CommandManager } from "../../command.js";
import { RulesCache } from "./rules.js";

const WORLD_RULES_KEY = "worldRules";

// TODO add <add | remove | set> enum?
CommandManager.register(
    {
        name: "ruleset",
        description: "Sets the world specific rules that can be viewed by any player using /rules",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "line", type: CustomCommandParamType.Integer }],
        optionalParameters: [{ name: "rule", type: CustomCommandParamType.String }],
    },
    (origin, rule: string, line: number = 1) => {
        const rules = JSON.parse(world.getDynamicProperty(WORLD_RULES_KEY) as string) ?? [];
        rules[line] = rule || undefined;

        world.setDynamicProperty(WORLD_RULES_KEY, JSON.stringify(rules));
        RulesCache.clear();
        return {
            status: CustomCommandStatus.Success,
            message: `Successfully set custom rule at line ${line}`,
        };
    }
);
