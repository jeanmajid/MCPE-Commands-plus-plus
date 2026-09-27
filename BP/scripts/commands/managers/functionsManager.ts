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

import { world } from "@minecraft/server";

import { DatabaseFrontEnd, JsonDatabase } from "../../database/frontEnd.js";

//const FUNCTION_INSERT_SUCCESS_OUTPUT = "Successfully inserted command into function at line ";
//const FUNCTION_POP_SUCCESS_OUTPUT = "Successfully removed command from function at line ";

export enum FMResult {
    Success,
    NotFound,
    NameCollision,
    InvalidName,
    Empty,
}
export class FunctionsManager {
    public static readonly INSTANCE = new FunctionsManager();

    public readonly db: DatabaseFrontEnd<{ [k: string]: string[] }>;
    protected constructor() {
        this.db = JsonDatabase.create({ namespace: "::functions::", target: world, large: true });
    }

    public createC(name: string): FMResult {
        if (!FunctionsManager.validate(name)) {
            return FMResult.InvalidName;
        }

        const raw = this.db.get(name);
        if (raw !== null) {
            return FMResult.NameCollision;
        }

        this.db.set(name, []);

        return FMResult.Success;
    }

    public deleteC(name: string): FMResult {
        if (!FunctionsManager.validate(name)) {
            return FMResult.InvalidName;
        }

        const raw = this.db.get(name);
        if (raw === null) {
            return FMResult.NotFound;
        }

        this.db.delete(name);

        return FMResult.Success;
    }

    public insertC(name: string, runnable: string, index?: number): FMResult {
        if (!FunctionsManager.validate(name)) {
            return FMResult.InvalidName;
        }

        const raw = this.db.get(name);
        if (raw === null) {
            return FMResult.NotFound;
        }

        runnable = FunctionsManager.cleanCommandSyntax(runnable);

        raw.splice(index ?? raw.length, 0, runnable);
        this.db.set(name, raw);

        return FMResult.Success;
    }

    public popC(name: string, index?: number): FMResult {
        if (!FunctionsManager.validate(name)) {
            return FMResult.InvalidName;
        }

        const raw = this.db.get(name);
        if (raw === null) {
            return FMResult.NotFound;
        }

        if (index === undefined) {
            raw.pop();
        } else {
            raw.splice(index, 1);
        }

        this.db.set(name, raw);
        return FMResult.Success;
    }

    public getFunctionData(name: string): { data?: readonly string[]; result: FMResult } {
        if (!FunctionsManager.validate(name)) {
            return { result: FMResult.InvalidName };
        }

        const raw = this.db.get(name);
        if (raw === null) {
            return { result: FMResult.NotFound };
        }

        return { data: raw, result: FMResult.Success };
    }

    // better strict as we can always make it less strict later
    public static validate(name: string): boolean {
        return /^[a-z0-9_/]+$/i.test(name);
    }

    /**
     * Identifies & removes all forward-slashes in the command excluding forward-slashes within any scope of quotations
     * @returns A forward-slash cleaned command that is executable via the runCommand method
     */
    public static cleanCommandSyntax(command: string): string {
        if (command.startsWith("/")) {
            command = command.substring(1);
        }

        const pattern = /("[^"\\]*(?:\\.[^"\\]*)*")|(\brun\s+)\//g;

        return command.replace(pattern, (_, group1, group2) => {
            if (group1) {
                return group1;
            }

            return group2;
        });
    }
}

export const FUNCTION_MANAGER: FunctionsManager = FunctionsManager.INSTANCE;
