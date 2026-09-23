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

export abstract class BaseGameRule<T> {
    public abstract id: string;
    public abstract value: T;

    /**
     * Gets called when the gamerule is enabled
     */
    public abstract activation(): void;

    /**
     * Gets called when the gamerule is enabled
     */
    public abstract deactivation(): void;

    /**
     * Turns an gamerule input string into the actual value to work with
     */
    public abstract getValue(input: string): T;
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

    public static loadGameRulesFromMemory(): void {}
}
