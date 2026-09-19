import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

import { parse } from "@yuku-parser/wasm";

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

const outputStrings = new Map<string, string>();
const commandCount = 0;

const COMMANDS_FOLDER_PATH = "../../BP/scripts/commands";
const REGISTRY_PATH = join(COMMANDS_FOLDER_PATH, "/registry");

recursiveRead(REGISTRY_PATH);

function recursiveRead(directoryPath: string): void {
    for (const filePath of readdirSync(directoryPath)) {
        const finalPath = join(directoryPath, filePath);

        if (statSync(finalPath).isDirectory()) {
            recursiveRead(finalPath);
        } else {
            processFile(finalPath);
        }
    }
}

function processFile(filePath: string): void {
    const currentDirname = basename(dirname(filePath));
    const currentOutputString = outputStrings.get(currentDirname) ?? "";
    const fileContents = readFileSync(filePath, "utf-8");

    const { program, comments, diagnostics } = parse(fileContents, { lang: "ts" });

    for (const token of program.body) {
        if (token.type !== "ExpressionStatement" || token.expression.type !== "CallExpression") {
            continue;
        }

        const { callee } = token.expression;
        if (
            callee.type !== "MemberExpression" ||
            callee.object.type !== "Identifier" ||
            callee.property.type !== "Identifier"
        ) {
            continue;
        }

        const className = callee.object.name;
        const methodName = callee.property.name;

        const commandInfoToken = token.expression.arguments[0];
        if (
            className !== "CommandManager" ||
            methodName !== "registerCommand" ||
            commandInfoToken.type !== "ObjectExpression"
        ) {
            continue;
        }

        for (const propertyToken of commandInfoToken.properties) {
            if (propertyToken.type !== "Property") {
                continue;
            }

            console.log(propertyToken.key);
            console.log(propertyToken.value);
        }
    }

    return;

    // const commandData: Record<string, unknown> = {};

    // const command = commandData as unknown as CommandData;
    // let parameters = "";

    // if (command.mandatoryParameters) {
    //     parameters += command.mandatoryParameters
    //         .map(
    //             (parameter) =>
    //                 `\`<${parameter.name}: ${parameter.type.replace("CustomCommandParamType.", "")}>\``
    //         )
    //         .join(" • ");
    // }

    // if (command.optionalParameters) {
    //     if (command.mandatoryParameters) {
    //         parameters += " • ";
    //     }
    //     parameters += command.optionalParameters
    //         .map(
    //             (parameter) =>
    //                 `\`[${parameter.name}: ${parameter.type.replace("CustomCommandParamType.", "")}]\``
    //         )
    //         .join(" • ");
    // }

    // let commandWithoutName = "\n";

    // if (parameters) {
    //     commandWithoutName += "> **Parameters:** " + parameters + "\n";
    // }

    // commandWithoutName += "> \n";
    // commandWithoutName += `> ${command.description}\n`;
    // commandWithoutName += "> \n";
    // commandWithoutName += `> \`${command.permissionLevel.replace("CommandPermissionLevel.", "")}\``;

    // currentOutputString += `> ### \`/${command.name}\`${commandWithoutName}\n\n`;
    // ++commandCount;

    // if (command.aliases) {
    //     for (const alias of command.aliases) {
    //         currentOutputString += `> ### \`/${alias}\`${commandWithoutName} • *Alias of \`/${command.name}\`*\n\n`;
    //         ++commandCount;
    //     }
    // }

    // outputStrings.set(currentDirname, currentOutputString);
}

let outputString = "# Commands++ Commands\n";
outputString += `## Total Amount of Commands: ${commandCount}\n`;

for (const [key, value] of outputStrings.entries()) {
    outputString += `\n\n## ${key}\n\n${value}`;
}

writeFileSync("./output.md", outputString);
