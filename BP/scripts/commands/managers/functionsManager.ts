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
    CustomCommandOrigin,
    CustomCommandResult,
    CustomCommandStatus,
    system,
    world,
} from "@minecraft/server";

import { Dimensions } from "../../constants/dimensions.js";
import { FUNCTIONS_KEY } from "../../constants/dynamicPropertyKeys.js";

export class FunctionsManager {
    public static cache: Map<string, string[]> = new Map();

    /**
     * Handles the building of the function -- setting commands at lines & doing initial cleanup / parenting logic
     */
    public static build(id: string, line: number, command: string): void {
        const propertyKey = FUNCTIONS_KEY + id;
        const func = JSON.parse(world.getDynamicProperty(propertyKey) as string) ?? [];

        func[line] = this.cleanCommandSyntax(command);
        world.setDynamicProperty(propertyKey);
    }

    /**
     * Pushes function data to memory for faster access times when next called after first use in a session
     */
    public static pushToCache(id: string, func: string[]): void {
        this.cache.set(id, func);
    }

    /**
     * Loads function data from the cache if available for faster retrieval
     * @returns Functon data (an array of commands to run sequentially), or undefind if no function is found in memory
     */
    public static loadFromCache(id: string): string[] | undefined {
        return this.cache.get(id);
    }

    /**
     * Runs the function line-by-line from the command origin
     * @returns The command result (success-state) of whether or not the function was able to run successfully
     */
    public static runFunction(origin: CustomCommandOrigin, id: string): CustomCommandResult {
        let func = this.loadFromCache(id);
        if (!func) {
            func = JSON.parse(world.getDynamicProperty(FUNCTIONS_KEY + id) as string);
            if (!func) {
                return { status: CustomCommandStatus.Failure, message: "Function not found" };
            }
        }

        const source =
            origin.sourceBlock?.dimension ??
            origin.sourceEntity ??
            origin.initiator ??
            Dimensions.overworld;

        system.run(() => {
            for (const command of func) {
                source.runCommand(command);
            }
        });

        this.pushToCache(id, func);
        return { status: CustomCommandStatus.Success, message: "Successfully ran function" };
    }

    /**
     * Deletes a function from both disk & memory if available
     * @returns The command result (success-state) of whether or not the function was able to run successfully
     */
    public static deleteFunction(id: string): CustomCommandResult {
        const propertyKey = FUNCTIONS_KEY + id;
        if (world.getDynamicProperty(propertyKey)) {
            world.setDynamicProperty(propertyKey, undefined);
            this.cache.delete(id);
            return {
                status: CustomCommandStatus.Success,
                message: "Successfully deleted function",
            };
        }

        return { status: CustomCommandStatus.Failure, message: "Function does not exist" };
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
