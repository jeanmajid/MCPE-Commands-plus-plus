import { ChatCommand } from "../../models/chatCommand";
import { Module } from "../../models/module";

ChatCommand.register(
    {
        name: "interval",
        description: "Set the update interval of a scoreboard module",
    },
    ({ source, args }) => {
        const module = Module.getModuleWithMessage(args[0]);
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
    }
);
