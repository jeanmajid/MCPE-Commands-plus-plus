import { world, system } from "@minecraft/server";
import { Module } from "./module";
import { levenshteinDistance } from "./utils";
import { register } from "./register";
import { eventProperties } from "./eventProperties";

const commands = [
    { name: "help", description: "Show available commands" },
    { name: "search", description: "Search for modules" },
    { name: "disable", description: "Disable a module" },
    { name: "enable", description: "Enable a module" },
    { name: "interval", description: "Set the interval of a scoreboard module" },
    { name: "scoreboard", description: "Set the scoreboard of a scoreboard module" },
    { name: "code", description: "Set the code of an event module" },
    { name: "resetdata", description: "Reset all addon data (confirmation required)" },
    { name: "methods", description: "Show available methods of an event module" },
    { name: "source", description: "Set the source of an event module" },
    { name: "bytes", description: "Show the amount of bytes used by a module" },
];

world.beforeEvents.chatSend.subscribe((data) => {
    if (!data.sender.isOp()) return;
    if (!data.message.startsWith("!")) return;
    data.cancel = true;
    const command = data.message.split(/ /)[0].slice(1).toLowerCase();
    const args = data.message.split(/ /).slice(1);
    handleCommands(command, args, data.sender);
});

system.afterEvents.scriptEventReceive.subscribe((data) => {
    if (!data.id.startsWith("jmc:")) return;
    const command = data.id.slice(4).toLowerCase();
    const args = data.message.split(/ /);
    handleCommands(command, args, data.initiator ?? data.sourceBlock ?? data.sourceEntity);
});

function handleCommands(command, args, source) {
    source.sendMessage ??= (_) => {};
    let module = null;
    switch (command) {
        case "help":
            source.sendMessage("§9Available commands:");
            commands.forEach((cmd) => {
                source.sendMessage(`§9- §b${cmd.name}: §7${cmd.description}`);
            });
            break;
        case "search":
            switch (args[0]) {
                case "help":
                    source.sendMessage(`§9Usage: §b!search <type> [search <string>] [state <on/off>] [type <before/after>]`);
                    break;
                case "all":
                    searchModules(args, Module.getAllModules(), source);
                    break;
                case "score":
                    searchModules(args, Module.scoreModules, source);
                    break;
                case "event":
                    searchModules(args, Module.eventModules, source);
                    break;
                default:
                    source.sendMessage(`§cSpecify a type of module to show (all, score, event)`);
                    break;
            }
            break;
        case "disable":
            if (!args[0]) return source.sendMessage(`§cInvalid argument: Please input something`);
            source.sendMessage(Module.toggleModule(args[0], false));
            system.run(() => {
                register();
            });
            break;
        case "enable":
            if (!args[0]) return source.sendMessage(`§cInvalid argument: Please input something`);
            source.sendMessage(Module.toggleModule(args[0], true));
            system.run(() => {
                register();
            });
            break;
        case "interval":
            module = getModule(args[0]);
            if (module.error) return source.sendMessage(module.message);
            if (!module.scoreboard) return source.sendMessage(`§cModule ${module.name} is not of type scoreboard`);
            const interval = parseInt(args[2]);
            if (isNaN(interval)) {
                source.sendMessage(`§c"${args[2]}" is not a valid number`);
            } else {
                module.interval = interval;
                source.sendMessage(`§aSet interval of ${module.name} to ${module.interval}`);
                Module.updateModule(module);
            }
            break;
        case "scoreboard":
            module = getModule(args[0]);
            if (module.error) return source.sendMessage(module.message);
            if (!module.scoreboard) return source.sendMessage(`§cModule ${module.name} is not of type scoreboard`);
            module.scoreboard = args[2];
            source.sendMessage(`§aSet scoreboard of ${module.name} to ${module.scoreboard}`);
            Module.updateModule(module);
            break;
        case "source":
            module = getModule(args[0]);
            if (module.error) return source.sendMessage(module.message);
            if (!module.event) return source.sendMessage(`§cModule ${module.name} is not of type event`);
            switch (args[1]) {
                case "show":
                    source.sendMessage(`§aSource of ${module.name}: ${module.source}`);
                    break;
                case "available":
                    source.sendMessage(`§9Available sources for ${module.name}:`);
                    world.sendMessage("§9- §bworld");
                    module.methods.forEach((method) => {
                        source.sendMessage(`§9- §b${method}`);
                    });
                    source.sendMessage("§cBe careful when choosing a source. Most sources may not work as expected and could break the addon, so try choosing the actual player or entity.");
                    break;
                case "set":
                    if (!module.methods.includes(args[2]) && args[2] !== "world")
                        return source.sendMessage(`§cNo method named ${args[2]} found, use !source <module> available to see all available sources`);
                    module.source = args[2];
                    source.sendMessage(`§aSet source of ${module.name} to ${module.source}`);
                    Module.updateModule(module);
                    break;
                default:
                    source.sendMessage(`§cSpecify a subcommand (show, set, available)`);
                    break;
            }
            break;
        case "code":
            let lineIndex;
            module = getModule(args[0]);
            if (module.error) return source.sendMessage(module.message);
            if (!module.event) return source.sendMessage(`§cModule ${module.name} is not of type event`);
            switch (args[1]) {
                case "add":
                    lineIndex = parseInt(args[2]) - 1;
                    if (isNaN(lineIndex) || lineIndex < 0 || lineIndex >= module.code.length) {
                        module.code.push(args.slice(2).join(" "));
                    } else {
                        module.code.splice(lineIndex + 1, 0, args.slice(3).join(" "));
                    }
                    Module.updateCode(module);
                    source.sendMessage(`§aAdded code to ${module.name}`);
                    showCode(source, module);
                    break;
                case "remove":
                    lineIndex = parseInt(args[2]) - 1;
                    if (isNaN(lineIndex) || lineIndex < 0 || lineIndex >= module.code.length) return source.sendMessage(`§cInvalid line number`);
                    module.code.splice(lineIndex, 1);
                    Module.updateCode(module);
                    source.sendMessage(`§aRemoved line ${lineIndex + 1} of code from ${module.name}`);
                    showCode(source, module);
                    break;
                case "set":
                    lineIndex = parseInt(args[2]) - 1;
                    if (isNaN(lineIndex) || lineIndex < 0 || lineIndex >= module.code.length) return source.sendMessage(`§cInvalid line number`);
                    module.code[lineIndex] = args.slice(3).join(" ");
                    Module.updateCode(module);
                    source.sendMessage(`§aSet line ${lineIndex + 1} of code of ${module.name} to ${module.code[lineIndex]}`);
                    showCode(source, module);
                    break;
                case "setall":
                    const code = args.slice(2).join(" ").split(/;/);
                    if (code[0].length < 1) return source.sendMessage(`§cNo code provided`);
                    module.code = code;
                    Module.updateCode(module);
                    source.sendMessage(`§aSet code of ${module.name} to ${module.code}`);
                    showCode(source, module);
                    break;
                case "show":
                    if (args[2] === "compiled") {
                        if (!module.compiledCode) return source.sendMessage(`§cCode of ${module.name} is not compiled yet`);
                        const codeLines = module.compiledCode.toString().split("\n");
                        const formattedCodeLines = codeLines.map((line, index) => `§7${index + 1} §b${line}`);
                        source.sendMessage(`§dCompiled code of ${module.name}`);
                        formattedCodeLines.forEach((line) => {
                            source.sendMessage(`§b${colorizeCode(line)}`);
                        });
                        break;
                    }
                    if (module.code.length < 1) return source.sendMessage(`§cNo Code available for this module`);
                    showCode(source, module);
                    break;
                default:
                    source.sendMessage(`§cSpecify a subcommand (add, remove, set, setall, show)`);
                    break;
            }
            break;
        case "resetdata":
            if (args[0] !== "CONFIRM") return source.sendMessage(`§cWarning: This action will delete all data related to the addon. If you want to confirm, type "CONFIRM" as the first argument.`);
            world.getDynamicPropertyIds().forEach((id) => {
                world.setDynamicProperty(id, undefined);
            });
            source.sendMessage(`§cReset all data related to the addon`);
            break;
        case "methods":
            module = getModule(args[0]);
            if (module.error) return source.sendMessage(module.message);
            if (!module.event) return source.sendMessage(`§cModule ${module.name} is not of type event`);
            if (args[1] && args[1].length > 0) {
                const method = module.methods.find((method) => method === args[1]);
                if (!method) return source.sendMessage(`§cNo method named ${args[1]} found, did you mean ${module.methods.find((method) => levenshteinDistance(method, args[1]) < 5)}?`);
                source.sendMessage(`§9Usage of ${method}:`);
                const methodProperties = eventProperties[module.name][method];
                if (methodProperties) {
                    for (const property in methodProperties) {
                        source.sendMessage(`§9- §b${property}: §7${methodProperties[property]}`);
                    }
                } else {
                    source.sendMessage(`§9- §bNo properties`);
                }
                break;
            }
            source.sendMessage(`§9Available methods for ${module.name}:`);
            module.methods.forEach((method) => {
                source.sendMessage(`§9- §b${method}`);
            });
            break;
        case "bytes":
            if (args[0] === "all" || args[0] === "total") {
                const { property, variable } = Module.getTotalAmountOfBytesUsed();
                source.sendMessage(`§9Amount of bytes used by all modules:`);
                source.sendMessage(`§9- §bVariable: §7${variable}`);
                source.sendMessage(`§9- §bProperty: §7${property}`);
                break;
            }
            module = getModule(args[0]);
            if (module.error) return source.sendMessage(module.message);
            const { property, variable } = Module.getAmountOfBytesUsed(module);
            source.sendMessage(`§9Amount of bytes used by ${module.name}:`);
            source.sendMessage(`§9- §bVariable: §7${variable}`);
            source.sendMessage(`§9- §bProperty: §7${property}`);
            break;
        default:
            let mostSimilarCommand = null;
            let minDistance = Infinity;
            for (const cmd of commands) {
                const distance = levenshteinDistance(command, cmd.name);
                if (distance < minDistance) {
                    minDistance = distance;
                    mostSimilarCommand = cmd;
                }
            }
            source.sendMessage(`§cUnknown command ${command}. Did you mean ${mostSimilarCommand.name} ?`);
            break;
    }
}

function getModule(name) {
    let module = Module.getModule(name);
    if (!name || name.length < 1) return { error: true, message: "§cSpecify a module" };
    if (!module) return { error: true, message: `§cNo module named ${name} found, did you mean ${Module.getClosestModule(name).name}?` };
    return module;
}

function searchModules(args, modules, player) {
    let state, beforeOrAfter, searchString;

    for (let i = 1; i < args.length; i++) {
        switch (args[i]) {
            case "search":
                if (args[i + 1]) {
                    searchString = args[i + 1];
                    i++;
                } else {
                    player.sendMessage(`Please provide a search string.`);
                }
                break;
            case "state":
                if (args[i + 1]) {
                    state = args[i + 1];
                    i++;
                } else {
                    player.sendMessage(`Please provide a state (on/off).`);
                }
                break;
            case "type":
                if (args[i + 1]) {
                    beforeOrAfter = args[i + 1];
                    i++;
                } else {
                    player.sendMessage(`Please provide a type (before/after).`);
                }
                break;
        }
    }

    if (state) {
        state = state.toLowerCase();
        if (state === "off" || state === "false") state = false;
        else if (state === "on" || state === "true") state = true;
        else state = undefined;
    }
    if (beforeOrAfter) {
        if (beforeOrAfter !== "before" && beforeOrAfter !== "after") beforeOrAfter = undefined;
    }

    const filteredEvents = modules.filter((module) => {
        if (state !== undefined && module.state !== state) {
            return false;
        }

        if (beforeOrAfter && module.type !== beforeOrAfter) {
            return false;
        }

        if (searchString) {
            if (module.name.toLowerCase().includes(searchString)) return true;
            if (levenshteinDistance(module.name.toLowerCase(), searchString.toLowerCase()) > 5) return false;
            // levensthein is extremely unenecessary here but I will keep for a while bcs its cool
        }

        return true;
    });

    const filteredScoreboardEvents = filteredEvents.filter((module) => module.scoreboard);
    const filteredAfterEvents = filteredEvents.filter((module) => module.type === "after");
    const filteredBeforeEvents = filteredEvents.filter((module) => module.type === "before");

    if (filteredScoreboardEvents.length > 0) {
        player.sendMessage("§b=== Scoreboard Events ===");
        for (const module of filteredScoreboardEvents) {
            if (module.state) {
                player.sendMessage(`§a${module.name} > §7${module.description || ""} `);
            } else {
                player.sendMessage(`§c${module.name} > §7${module.description || ""} `);
            }
        }
    }

    if (filteredAfterEvents.length > 0) {
        player.sendMessage("§b=== After Events ===");
        for (const module of filteredAfterEvents) {
            if (module.state) {
                player.sendMessage(`§a${module.name} > §7${module.description || ""} `);
            } else {
                player.sendMessage(`§c${module.name} > §7${module.description || ""} `);
            }
        }
    }

    if (filteredBeforeEvents.length > 0) {
        player.sendMessage("§b=== Before Events ===");
        for (const module of filteredBeforeEvents) {
            if (module.state) {
                player.sendMessage(`§a${module.name} > §7${module.description || ""} `);
            } else {
                player.sendMessage(`§c${module.name} > §7${module.description || ""} `);
            }
        }
    }
}

function colorizeCode(code) {
    // @text
    code = code.replace(/(@\w+)/g, "§a$1§b");
    // if
    code = code.replace(/\b(if)\b/g, "§6$1§b");

    code = `§b${code}`;

    return code;
}

function showCode(source, module) {
    source.sendMessage(`§dCode of ${module.name}:`);
    module.code.forEach((line, index) => {
        source.sendMessage(`§7${index + 1} §b${colorizeCode(line)}`);
    });
}
