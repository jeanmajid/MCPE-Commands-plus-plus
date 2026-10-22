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
