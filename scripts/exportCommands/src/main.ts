import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

import ts from "typescript";

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

    let commandObject: ts.ObjectLiteralExpression | undefined;
    const sourceFile = ts.createSourceFile(
        filePath,
        fileContents,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TS
    );

    function visit(node: ts.Node): void {
        if (
            ts.isCallExpression(node) &&
            ts.isPropertyAccessExpression(node.expression) &&
            node.expression.expression.getText(sourceFile) === "CommandManager" &&
            node.expression.name.text === "registerCommand"
        ) {
            const firstArgument = node.arguments[0];

            if (firstArgument && ts.isObjectLiteralExpression(firstArgument)) {
                commandObject = firstArgument;
            }
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    if (!commandObject) {
        return;
    }

    const commandData: Record<string, unknown> = {};

    for (const property of commandObject.properties) {
        if (!ts.isPropertyAssignment(property)) {
            continue;
        }

        const key = property.name.getText(sourceFile).replace(/^['"]|['"]$/g, "");
        commandData[key] = readExpression(property.initializer, sourceFile);
    }

    const command = commandData as unknown as CommandData;
    let parameters = "";

    if (command.mandatoryParameters) {
        parameters += command.mandatoryParameters
            .map(
                (parameter) =>
                    `\`<${parameter.name}: ${parameter.type.replace("CustomCommandParamType.", "")}>\``
            )
            .join(" • ");
    }

    if (command.optionalParameters) {
        if (command.mandatoryParameters) {
            parameters += " • ";
        }
        parameters += command.optionalParameters
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
    commandWithoutName += `> ${command.description}\n`;
    commandWithoutName += "> \n";
    commandWithoutName += `> \`${command.permissionLevel.replace("CommandPermissionLevel.", "")}\``;

    currentOutputString += `> ### \`/${command.name}\`${commandWithoutName}\n\n`;
    ++commandCount;

    if (command.aliases) {
        for (const alias of command.aliases) {
            currentOutputString += `> ### \`/${alias}\`${commandWithoutName} • *Alias of \`/${command.name}\`*\n\n`;
            ++commandCount;
        }
    }

    outputStrings.set(currentDirname, currentOutputString);
}

let outputString = "# Commands++ Commands\n";
outputString += `## Total Amount of Commands: ${commandCount}\n`;

for (const [key, value] of outputStrings.entries()) {
    outputString += `\n\n## ${key}\n\n${value}`;
}

writeFileSync("./output.md", outputString);

function readExpression(node: ts.Node, sourceFile: ts.SourceFile): unknown {
    if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) {
        return node.text;
    }

    if (node.kind === ts.SyntaxKind.TrueKeyword) {
        return true;
    }

    if (node.kind === ts.SyntaxKind.FalseKeyword) {
        return false;
    }

    if (ts.isArrayLiteralExpression(node)) {
        return node.elements.map((element) => readExpression(element, sourceFile));
    }

    if (ts.isObjectLiteralExpression(node)) {
        const object: Record<string, unknown> = {};

        for (const property of node.properties) {
            if (!ts.isPropertyAssignment(property)) {
                continue;
            }

            const key = property.name.getText(sourceFile);
            object[key] = readExpression(property.initializer, sourceFile);
        }

        return object;
    }

    return node.getText(sourceFile);
}
