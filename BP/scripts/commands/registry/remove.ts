import {
    CommandPermissionLevel,
    CustomCommandStatus,
    system,
    CustomCommandParamType,
    Entity
} from "@minecraft/server";
import { CommandManager } from "../command.js";

CommandManager.registerCommand(
    {
        name: "remove",
        description: "Removes entites from the world",
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
                    entity.remove();
                } catch {
                    // skip
                }
            }
        });
        return { status: CustomCommandStatus.Success };
    }
);
