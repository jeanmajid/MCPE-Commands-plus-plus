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

import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

import { COMMAND_REGISTRY_PATH, WIKI_COMMAND_FOLDER_PATH } from "../constants/path.js";
import { TSParser } from "../parsers/TSParser.js";
import { recursiveReadDir } from "../utils/file.js";
import { writeToDocsFile } from "../utils/wiki.js";

interface Parameter {
    name: string;
    type: string;
}

interface CommandData {
    name: string;
    description: string;
    permissionLevel: string;
    mandatoryParameters?: Parameter[];
    optionalParameters?: Parameter[];
    aliases?: string[];
}

const enum CommandParameterType {
    mandatory,
    optional,
}

type CommandCategory = string;
type CommandName = string;
type CommandDocsString = string;
type CommandOut = Record<CommandCategory, Record<CommandName, CommandDocsString>>;

const outPutCommands: CommandOut = {};
let aliasCount = 0;

const now = performance.now();

{
    const tasks: Promise<void>[] = [];
    for await (const path of recursiveReadDir(COMMAND_REGISTRY_PATH)) {
        tasks.push(processFile(path));
    }
    await Promise.all(tasks);
}
async function processFile(filePath: string): Promise<void> {
    const currentDirname = basename(dirname(filePath));

    if (!outPutCommands[currentDirname]) {
        outPutCommands[currentDirname] = {};
    }
    const currentOutputCategory = outPutCommands[currentDirname];

    const fileContents = await readFile(filePath, "utf-8");
    const tsParser = new TSParser(fileContents);

    const registerCommandCall = tsParser.findClassMethodCall("CommandManager", "register");
    if (!registerCommandCall) {
        throw new Error("Command token not found in file: " + filePath);
    }

    const commandInfoObject = registerCommandCall.expression.arguments[0];
    if (commandInfoObject.type !== "ObjectExpression") {
        throw new Error("Command info should be and object: " + filePath);
    }

    const commandData: CommandData | null = tsParser.getValue(commandInfoObject);
    if (!commandData) {
        throw new Error("Failed to parse file: " + filePath);
    }

    const commandKey = commandData.name;
    let currentOutPutCommand = currentOutputCategory[commandKey] ?? "";

    const parameters: { type: CommandParameterType; string: string }[] = [];

    if (commandData.mandatoryParameters) {
        parameters.push(
            ...commandData.mandatoryParameters.map((parameter) => {
                return {
                    type: CommandParameterType.mandatory,
                    string: `<${parameter.name}: ${parameter.type}>`,
                };
            })
        );
    }

    if (commandData.optionalParameters) {
        parameters.push(
            ...commandData.optionalParameters.map((parameter) => {
                return {
                    type: CommandParameterType.optional,
                    string: `[${parameter.name}: ${parameter.type}]`,
                };
            })
        );
    }

    const aliases = commandData.aliases
        ? `

### Aliases:

${commandData.aliases.map((a) => `\`/${a}\``).join(", ")}`
        : "";

    currentOutPutCommand += `${commandData.description}

### Syntax:

\`\`\`
/${commandData.name}${parameters.length !== 0 ? " " : ""}${parameters.map((p) => p.string).join(" ")}
\`\`\`${aliases}

### Permission:

${commandData.permissionLevel}`;

    //++commandCount;
    if (commandData.aliases) {
        aliasCount += commandData.aliases.length;
    }

    currentOutputCategory[commandKey] = currentOutPutCommand;
}

// let outputString = "# Commands++ Commands\n";
// outputString += `## Total Amount of Commands: ${commandCount}\n`;

for (const [category, commands] of Object.entries(outPutCommands)) {
    const categoryPath = join(WIKI_COMMAND_FOLDER_PATH, category);
    if (!existsSync(categoryPath)) {
        await mkdir(categoryPath);
    }

    const tasks: Promise<void>[] = [];
    for (const [commandName, commandOut] of Object.entries(commands)) {
        const commandPath = join(categoryPath, commandName);

        tasks.push(writeToDocsFile(commandPath, commandOut));
    }

    await Promise.all(tasks);
}

console.log(`Succesfully generated command data in ${performance.now() - now}ms`);
