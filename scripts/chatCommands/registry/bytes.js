import { ChatCommand } from "../../models/chatCommand";
import { Module } from "../../models/module";

ChatCommand.register(
    {
        name: "bytes",
        description: "Show the amount of bytes used by a module",
    },
    ({ source, args }) => {
        if (args[0] === "all" || args[0] === "total") {
            const { property, variable } = Module.getTotalAmountOfBytesUsed();
            source.sendMessage(`§9Amount of bytes used by all modules:`);
            source.sendMessage(`§9- §bVariable: §7${variable}`);
            source.sendMessage(`§9- §bProperty: §7${property}`);
            return;
        }
        const module = Module.getModuleWithMessage(args[0]);
        if (module.error) return source.sendMessage(module.message);
        const { property, variable } = Module.getAmountOfBytesUsed(module);
        source.sendMessage(`§9Amount of bytes used by ${module.name}:`);
        source.sendMessage(`§9- §bVariable: §7${variable}`);
        source.sendMessage(`§9- §bProperty: §7${property}`);
    }
);
