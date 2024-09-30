import { ChatCommand } from "../../models/chatCommand";

ChatCommand.register(
    {
        name: "help",
        description: "Get a list of all available commands",
        aliases: ["?"]
    },
    ({ source, args }) => {
        if (source?.typeId !== "minecraft:player") return;
        source.sendMessage("§9Available commands:");
        for (const [name, command] of Object.entries(ChatCommand.commands)) {
            source.sendMessage(`§9- §b${name}: §7${command.description}`);
        }
    }
);
