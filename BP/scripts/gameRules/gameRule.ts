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

import { world } from "@minecraft/server";

import { GAMERULE_KEY } from "../constants/dynamicPropertyKeys.js";
import { EnumManager } from "../enums/enum.js";

type TypeOfTypes =
    | "string"
    | "number"
    | "bigint"
    | "boolean"
    | "symbol"
    | "undefined"
    | "object"
    | "function";

export abstract class BaseGameRule<T> {
    public abstract id: string;
    /**
     * Current value of the gamerule, automatically gets updated. Set to your default value
     */
    public abstract value: T;

    /**
     * Gets called when the gamerule value is changed and on startup
     *
     * OnValueUpdate will only be called, when the value actually changes.
     * So true to true will not trigger it, while true to false will
     */
    public abstract onValueUpdate(): void;
}

export class GameRuleManager {
    public static gameRules: Record<string, BaseGameRule<unknown>> = {};

    public static register(gameRule: BaseGameRule<unknown>): void {
        if (this.get(gameRule.id)) {
            console.error("Duplicate gamerule registered: " + gameRule.id);
        }
        this.gameRules[gameRule.id] = gameRule;
    }

    public static get(id: string): BaseGameRule<unknown> | undefined {
        return this.gameRules[id];
    }

    public static loadGameRulesFromMemory(): void {
        for (const propertyId of world.getDynamicPropertyIds()) {
            if (!propertyId.startsWith(GAMERULE_KEY)) {
                continue;
            }

            const gameRuleId = propertyId.substring(GAMERULE_KEY.length);
            const gameRule = this.get(gameRuleId);
            if (!gameRule) {
                console.warn(
                    `ERROR: cannot find Game Rule ${gameRule}, which is found in storage... Deleting`
                );
                world.setDynamicProperty(propertyId, undefined);
                continue;
            }

            const unparsedValue = world.getDynamicProperty(propertyId);
            const gameRuleValue = this.parseGameRuleValueString(
                unparsedValue as string,
                typeof gameRule.value
            );

            if (gameRuleValue === null) {
                console.error("Failed to parse gamerule from memory: " + unparsedValue);
                continue;
            }

            gameRule.value = gameRuleValue;

            gameRule.onValueUpdate();
        }
    }

    public static parseGameRuleValueString(string: string, valueType: TypeOfTypes): unknown | null {
        // TODO: make this some sort of string to value mapping thing, so we can also give possible values autocompletions easy peasy
        switch (valueType) {
            case "boolean":
                if (string === "true") {
                    return true;
                }
                if (string === "false") {
                    return false;
                }
                return null;
            default:
                console.error("Trying to access unsupported GameRule Type: " + valueType);
                return null;
        }
    }

    /**
     * Only should be called once after all game rules are registered in the before world load enviroment
     */
    public static initialize(): void {
        EnumManager.register(GAMERULE_KEY, Object.keys(GameRuleManager.gameRules));
    }
}
