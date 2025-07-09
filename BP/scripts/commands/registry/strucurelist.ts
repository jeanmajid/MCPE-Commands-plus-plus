import {
    CommandPermissionLevel,
    Player,
    CustomCommandStatus,
    world,
    system
} from "@minecraft/server";
import { CommandManager } from "../command.js";

CommandManager.registerCommand(
    {
        name: "structurelist",
        description: "list all the structures on the world",
        permissionLevel: CommandPermissionLevel.Admin
    },
    (origin) => {
        system.run(() => {
            if (!(origin.sourceEntity instanceof Player)) {
                return { status: CustomCommandStatus.Failure };
            }

            const structureIds = world.structureManager.getWorldStructureIds();
            const message =
                structureIds.length > 0
                    ? `§aStructures in world:\n§7${structureIds.join("\n§7")}`
                    : "§cNo structures found in world";
            origin.sourceEntity.sendMessage(message);
        });
        return { status: CustomCommandStatus.Success };
    }
);
