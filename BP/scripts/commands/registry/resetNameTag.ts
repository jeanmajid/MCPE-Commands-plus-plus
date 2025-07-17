import {
    CommandPermissionLevel,
    CustomCommandStatus,
    system,
    CustomCommandParamType,
    Entity,
    Player
} from "@minecraft/server";
import { CommandManager } from "../command.js";

CommandManager.registerCommand(
    {
        name: "resetnametag",
        description: "Reset the nametag for players",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "targets",
                type: CustomCommandParamType.EntitySelector
            }
        ]
    },
    (origin, targets: Entity[]) => {
        system.run(() => {
            for (const entity of targets) {
                try {
                    if (entity instanceof Player) {
                        entity.nameTag = entity.name;
                    } else {
                        entity.nameTag = "";
                    }
                } catch {
                    // skip
                }
            }
        });
        return { status: CustomCommandStatus.Success };
    }
);
