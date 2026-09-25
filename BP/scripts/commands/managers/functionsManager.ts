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

const FUNCTION_INSERT_SUCCESS_OUTPUT = "Successfully inserted command into function at line ";
const FUNCTION_POP_SUCCESS_OUTPUT = "Successfully removed command from function at line ";

export class FunctionsManager {
    public static cache: Map<string, string[]> = new Map();

    /**
     * Inserts or replaces the command at the provided line within a function
     *
     * Appends to a new line at the end of the function when the 'line' parameter is undefined
     * @returns The command result (success-state) of whether or not the function was able to run successfully
     */
    public static insertCommand(id: string, command: string, line?: number): CustomCommandResult {
        const propertyKey = FUNCTIONS_KEY + id;
        const func = this.loadFunctionFromDisk(propertyKey);

        const cleanCommand = this.cleanCommandSyntax(command);
        if (line === undefined) {
            func.push(cleanCommand);
            this.writeFunctionToDisk(propertyKey, func);
            return {
                status: CustomCommandStatus.Success,
                message: FUNCTION_INSERT_SUCCESS_OUTPUT + func.length,
            };
        }

        func[line - 1] = cleanCommand;
        this.writeFunctionToDisk(propertyKey, func);
        return {
            status: CustomCommandStatus.Success,
            message: FUNCTION_INSERT_SUCCESS_OUTPUT + line,
        };
    }

    /**
     * Delete the command at the provided line within a function
     *
     * Defaults to the last command line of the function when the 'line' parameter is undefined
     * @returns The command result (success-state) of whether or not the function was able to run successfully
     */
    public static popCommand(id: string, line?: number): CustomCommandResult {
        const propertyKey = FUNCTIONS_KEY + id;
        let func: string[] | undefined = this.loadFunctionFromDisk(propertyKey);

        if (line === undefined) {
            const funcLength = func.length;
            func.pop();

            this.writeFunctionToDisk(propertyKey, func);
            return {
                status: CustomCommandStatus.Success,
                message: FUNCTION_POP_SUCCESS_OUTPUT + funcLength,
            };
        }

        delete func[line - 1];

        if (func.length === 0) {
            func = undefined;
        }

        this.writeFunctionToDisk(propertyKey, func);
        return { status: CustomCommandStatus.Success, message: FUNCTION_POP_SUCCESS_OUTPUT + line };
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
     * Lists all functions saved to the disk
     * @returns The command result (success-state) of whether or not the function was able to run successfully
     */
    public static listFunctions(): string {
        const functionsList = [];

        for (const propertyId of world.getDynamicPropertyIds()) {
            if (!propertyId.startsWith(FUNCTIONS_KEY)) {
                continue;
            }

            functionsList.push(propertyId.replace(FUNCTIONS_KEY, ""));
        }

        return functionsList.join("\n");
    }

    /**
     * Lists all functions saved to the disk
     * @returns The command result (success-state) of whether or not the function was able to run successfully
     */
    public static listFunctionData(id: string): string {
        const func = this.loadFunctionFromDisk(id);
        const commandsListIndexed = [];
        const maxLineLengthDigits = String(commandsListIndexed.length).length;

        for (let i = 0; i < func.length; ++i) {
            const linePrefix = String(i + 1).padStart(maxLineLengthDigits, " ");
            commandsListIndexed.push(`§8${linePrefix} §f${func[i]}`);
        }

        return commandsListIndexed.join("\n");
    }

    /**
     * Runs the function line-by-line from the command origin
     * @returns The command result (success-state) of whether or not the function was able to run successfully
     */
    public static runFunction(origin: CustomCommandOrigin, id: string): CustomCommandResult {
        let func = this.loadFromCache(id);
        if (!func) {
            func = this.loadFunctionFromDisk(id);
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
                // TODO add </sequenceabort> command to early exit mid-way through a function call
                source.runCommand(command);
            }
        });

        this.pushToCache(id, func);
        return { status: CustomCommandStatus.Success, message: "Successfully ran function" };
    }

    /**
     * Loads the function data from dynamic properties stored on the world as an array
     * @returns The array of commands within the function
     */
    public static loadFunctionFromDisk(id: string): string[] {
        return (JSON.parse(world.getDynamicProperty(id) as string) as string[]) ?? [];
    }

    /**
     * Writes the function data to dynamic properties stored on the world as a string
     */
    public static writeFunctionToDisk(
        propertyKey: string,
        functionData: string[] | undefined
    ): void {
        world.setDynamicProperty(propertyKey, JSON.stringify(functionData));
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
