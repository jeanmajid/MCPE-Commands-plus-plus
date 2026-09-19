import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

import { Expression, ObjectExpression, parse, PropertyKey } from "@yuku-parser/wasm";

const ENUM_CONVERSION: Record<string, Record<string, string>> = {
    CommandPermissionLevel: {
        Any: "Everyone",
        GameDirectors: "Operators + Command Blocks",
        Admin: "Operator",
    },
    CustomCommandParamType: {
        Enum: "Enum",
        String: "String",
        BlockType: "Block",
        Location: "Location",
        Integer: "Integer",
        EntitySelector: "Entity",
        Float: "Float",
        Boolean: "Boolean",
        PlayerSelector: "Player",
        ItemType: "Item",
    },
};

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
let commandCount = 0;

const COMMANDS_FOLDER_PATH = "../../BP/scripts/commands";
const REGISTRY_PATH = join(COMMANDS_FOLDER_PATH, "/registry");

const now = performance.now();

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
    let currentOutputString = outputStrings.get(currentDirname) ?? "";
    const fileContents = readFileSync(filePath, "utf-8");

    const { program } = parse(fileContents, { lang: "ts" });

    let commandData: CommandData | null = null;

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

        commandData = getValue(commandInfoToken) as CommandData;
    }

    if (!commandData) {
        throw new Error("Failed to parse file: " + filePath);
    }

    let parameters = "";

    if (commandData.mandatoryParameters) {
        parameters += commandData.mandatoryParameters
            .map(
                (parameter) =>
                    `\`<${parameter.name}: ${parameter.type.replace("CustomCommandParamType.", "")}>\``
            )
            .join(" • ");
    }

    if (commandData.optionalParameters) {
        if (commandData.mandatoryParameters) {
            parameters += " • ";
        }
        parameters += commandData.optionalParameters
            .map(
                (parameter) =>
                    `\`[${parameter.name}: ${parameter.type.replace("CustomCommandParamType.", "")}]\``
            )
            .join(" • ");
    }

    let commandWithoutName = "\n";

    if (parameters) {
        commandWithoutName += "> **Parameters:** " + parameters + "\n";
    }

    commandWithoutName += "> \n";
    commandWithoutName += `> ${commandData.description}\n`;
    commandWithoutName += "> \n";
    commandWithoutName += `> \`${commandData.permissionLevel.replace("CommandPermissionLevel.", "")}\``;

    currentOutputString += `> ### \`/${commandData.name}\`${commandWithoutName}\n\n`;
    ++commandCount;

    if (commandData.aliases) {
        for (const alias of commandData.aliases) {
            currentOutputString += `> ### \`/${alias}\`${commandWithoutName} • *Alias of \`/${commandData.name}\`*\n\n`;
            ++commandCount;
        }
    }

    outputStrings.set(currentDirname, currentOutputString);
}

function getKey(key: PropertyKey): string {
    if (key.type !== "Identifier") {
        throw new Error("unexpected key type, we only support strings");
    }

    return key.name;
}

// oxlint-disable-next-line typescript/no-explicit-any
function getValue(value: Expression): any {
    switch (value.type) {
        case "Literal": {
            return value.value as string;
        }
        case "MemberExpression": {
            if (value.object.type !== "Identifier" || value.property.type !== "Identifier") {
                throw new Error("unexpected member expression");
            }

            const name = ENUM_CONVERSION[value.object.name]?.[value.property.name];
            if (!name) {
                throw new Error(
                    `unhandled enum conversion: ${value.object.name}.${value.property.name}`
                );
            }

            return name;
        }
        case "ArrayExpression": {
            // idk if this is actually type safe, but time will tell
            return value.elements.map((v) => getValue(v as Expression));
        }
        case "ObjectExpression": {
            return readObjectExpression(value);
        }
        case "Identifier": {
            return value.name;
        }
        default:
            console.debug(value);
            throw new Error("Unhandled value type: " + value.type);
    }
}

function readObjectExpression(objectExpression: ObjectExpression): object {
    // oxlint-disable-next-line typescript/no-explicit-any
    const returnObject: Record<string, any> = {};

    for (const propertyToken of objectExpression.properties) {
        if (propertyToken.type !== "Property") {
            throw new Error("unexpected property type, please implement SpreadElement");
        }

        const key = getKey(propertyToken.key);
        const value = getValue(propertyToken.value);

        returnObject[key] = value;
    }

    return returnObject;
}

let outputString = "# Commands++ Commands\n";
outputString += `## Total Amount of Commands: ${commandCount}\n`;

for (const [key, value] of outputStrings.entries()) {
    outputString += `\n\n## ${key}\n\n${value}`;
}

writeFileSync("./output.md", outputString);
console.log(`Succesfully generated command data in ${performance.now() - now}ms`);
