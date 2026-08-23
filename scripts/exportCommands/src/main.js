import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";

const outputStrings = new Map();
let commandCount = 0;

const COMMANDS_FOLDER_PATH = "../../BP/scripts/commands";
const REGISTRY_PATH = join(COMMANDS_FOLDER_PATH, "/registry");

recursiveRead(REGISTRY_PATH);

function recursiveRead(path) {
    for (const filePath of readdirSync(path)) {
        const finalPath = join(path, filePath);

        if (statSync(finalPath).isDirectory()) {
            recursiveRead(finalPath);
        } else {
            processFile(finalPath);
        }
    }
}

function processFile(path) {
    const currentDirname = basename(dirname(path));
    let currentOutputString = outputStrings.get(currentDirname) ?? "";
    const fileContents = readFileSync(path, "utf-8");

    // really hacky beautiful stable magnificent code, please look closely
    const registerIndexString = "CommandManager.registerCommand(";
    const registerIndex = fileContents.indexOf(registerIndexString);
    let newFileContents = fileContents.substring(registerIndex + registerIndexString.length, fileContents.indexOf("    },", registerIndex));
    newFileContents = newFileContents.trimEnd();

    const toQuote = ["name:", "description:", "permissionLevel:", "mandatoryParameters:", "optionalParameters:", "type:", "enumName:", "aliases:"];

    for (const quote of toQuote) {
        newFileContents = newFileContents.replaceAll(quote, `"${quote.substring(0, quote.length - 1)}":`);
    }

    newFileContents = newFileContents.replace("LOG_TYPE_ENUM_KEY", '"LOG_TYPE_ENUM_KEY"');
    newFileContents = newFileContents.replace(/\/\/.*$/gm, "");

    newFileContents = newFileContents.replaceAll(/(CommandPermissionLevel\.[^,]+)/g, '"$1"');
    newFileContents = newFileContents.replaceAll(/(CustomCommandParamType\.[^, ]+)/g, '"$1"');
    newFileContents = newFileContents.replace(/,(\s*[}\]])/g, "$1");

    if (newFileContents.endsWith(",")) {
        newFileContents = newFileContents.substring(0, newFileContents.length - 1);
    }
    newFileContents += "}";

    const commandData = JSON.parse(newFileContents);

    // > ### `/uv`
    // > **Parameters:** `[player: PlayerSelector]` • `[tpBack: Boolean]`
    // >
    // > Exits spectator mode and optionally returns the player to their original position.
    // >
    // > `GameDirectors` • *Alias of `/unvanish`*

    let parameters = "";
    if (commandData.mandatoryParameters) {
        parameters += commandData.mandatoryParameters.map((param) => `\`<${param.name}: ${param.type.replace("CustomCommandParamType.", "")}>\``).join(" • ");
    }

    if (commandData.optionalParameters) {
        if (commandData.mandatoryParameters) {
            parameters += " • ";
        }
        parameters += commandData.optionalParameters.map((param) => `\`[${param.name}: ${param.type.replace("CustomCommandParamType.", "")}]\``).join(" • ");
    }

    let commandWithoutName = "";

    commandWithoutName += `\n`;

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

let outputString = "# Commands++ Commands\n";
outputString += `## Total Amount of Commands: ${commandCount}\n`;

for (const [key, value] of outputStrings.entries()) {
    outputString += `\n\n## ${key}\n\n${value}`;
}

writeFileSync("./output.md", outputString);
