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
        name: "clearvelocity",
        description: "Clears target entities velocity",
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
                    entity.clearVelocity();
                } catch {
                    // skip
                }
            }
        });
        return { status: CustomCommandStatus.Success };
    }
);
