import { ChatCommand } from "../../models/chatCommand";
import { Module } from "../../models/module";

ChatCommand.register(
    {
        name: "scoreboard",
        description: "Set the scoreboard name of a scoreboard module",
    },
    ({ source, args }) => {
        const module = Module.getModuleWithMessage(args[0]);
        if (module.error) return source.sendMessage(module.message);
        if (!module.scoreboard) return source.sendMessage(`§cModule ${module.name} is not of type scoreboard`);
        if (!args[1]) return source.sendMessage(`§aScoreboard of ${module.name} is set to ${module.scoreboard}`);
        module.scoreboard = args[1];
        source.sendMessage(`§aSet scoreboard of ${module.name} to ${module.scoreboard}`);
        Module.updateModule(module);
    }
);
