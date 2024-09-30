import { ChatCommand } from "../../models/chatCommand";
import { Module } from "../../models/module";

ChatCommand.register(
    {
        name: "source",
        description: "Set the source of an module",
    },
    ({ source, args }) => {
        const module = Module.getModuleWithMessage(args[0]);
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
                Module.updateCode(module);
                break;
            default:
                source.sendMessage(`§cSpecify a subcommand (show, set, available)`);
                break;
        }
    }
);
