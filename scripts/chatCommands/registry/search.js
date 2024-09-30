import { ChatCommand } from "../../models/chatCommand";
import { Module } from "../../models/module";
import { levenshteinDistance } from "../../utils/levenshteinDistance";

ChatCommand.register(
    {
        name: "search",
        description: "Search for modules",
    },
    ({ source, args }) => {
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
    }
);

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