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
