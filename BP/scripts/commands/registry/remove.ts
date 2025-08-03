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
        let amount = 0;
        system.run(() => {
            for (const entity of targets) {
                try {
                    entity.remove();
                    ++amount;
                } catch {
                    // skip
                }
            }
        });
        return {
            status: CustomCommandStatus.Success,
            message: `Sucessfully removed ${amount} entities`
        };
    }
);
