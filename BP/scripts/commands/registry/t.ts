import { CommandPermissionLevel, CustomCommandStatus, world } from "@minecraft/server";
import { CommandManager } from "../command.js";

CommandManager.registerCommand(
    {
        name: "t",
        description: "Provides an output message in chat if the command has ran successfully",
        permissionLevel: CommandPermissionLevel.GameDirectors
    },
    (origin) => {
        if (!origin.sourceEntity) {
            return;
        }
        world.sendMessage("Command ran successfully");
        return {
            status: CustomCommandStatus.Success,
            message: `Command ran successfully`
        };
    }
);
