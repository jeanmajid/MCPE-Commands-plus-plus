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
        name: "applyknockback",
        description: "Applies knockback to the selected entities",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "targets",
                type: CustomCommandParamType.EntitySelector
            },
            {
                name: "x",
                type: CustomCommandParamType.Float
            },
            {
                name: "y",
                type: CustomCommandParamType.Float
            },
            {
                name: "z",
                type: CustomCommandParamType.Float
            }
        ]
    },
    (origin, targets: Entity[], x: number, y: number, z: number) => {
        system.run(() => {
            for (const entity of targets) {
                entity.applyKnockback({ x, z }, y);
            }
        });
        return { status: CustomCommandStatus.Success };
    }
);
