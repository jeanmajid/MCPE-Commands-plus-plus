import { ChatCommand } from "../../models/chatCommand";
import { world } from "@minecraft/server";

ChatCommand.register(
    {
        name: "resetdata",
        description: "Reset all addon data (confirmation required)",
    },
    ({ source, args }) => {
        if (args[0] !== "CONFIRM") return source.sendMessage(`§cWarning: This action will delete all data related to the addon. If you want to confirm, type "CONFIRM" as the first argument.`);
        world.getDynamicPropertyIds().forEach((id) => {
            world.setDynamicProperty(id, undefined);
        });
        source.sendMessage(`§cReset all data related to the addon`);
    }
);
