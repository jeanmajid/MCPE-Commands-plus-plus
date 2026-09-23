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
    Player,
    world,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

const WORLD_RULES_KEY = "worldRules";

export const rulesCache = "";

CommandManager.register(
    {
        name: "rules",
        description: "Outputs to chat the world specific rules",
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [{ name: "line", type: CustomCommandParamType.Integer }],
    },
    (origin, line: number) => {
        const source = origin.sourceEntity;
        if (!(source instanceof Player)) {
            return { status: CustomCommandStatus.Failure, message: "Invalid source" };
        }

        const rules: string[] = JSON.parse(world.getDynamicProperty(WORLD_RULES_KEY) as string);
        if (!rules) {
            return {
                status: CustomCommandStatus.Failure,
                message: "This world does not have any custom rules set",
            };
        }

        if (line) {
            source.sendMessage(rules[line]);
            return { status: CustomCommandStatus.Success };
        }

        RulesCache.set(rules);
        source.sendMessage(RulesCache.cache!);
        return { status: CustomCommandStatus.Success };
    }
);

export class RulesCache {
    public static cache: string | null = null;

    public static set(rules: string[]): void {
        if (this.cache === undefined) {
            this.cache = rules.join("\n");
        }
    }

    public static clear(): void {
        this.cache = null;
    }
}
