import { ChatCommand } from "../../models/chatCommand";
import { Module } from "../../models/module";
import { eventProperties } from "../../data/eventProperties.js";

ChatCommand.register(
    {
        name: "methods",
        description: "Show available methods of an event module",
    },
    ({ source, args }) => {
        if (source?.typeId !== "minecraft:player") return;
        const module = Module.getModuleWithMessage(args[0]);
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
            return;
        }
        source.sendMessage(`§9Available methods for ${module.name}:`);
        module.methods.forEach((method) => {
            source.sendMessage(`§9- §b${method}`);
        });
    }
);
