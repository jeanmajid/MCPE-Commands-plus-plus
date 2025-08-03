import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Entity,
    system
} from "@minecraft/server";
import { CommandManager } from "../command.js";

CommandManager.registerCommand(
    {
        name: "rotate",
        description: "Rotates an entity",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            {
                name: "target",
                type: CustomCommandParamType.EntitySelector
            },
            {
                name: "rotationX",
                type: CustomCommandParamType.Float
            },
            {
                name: "rotationY",
                type: CustomCommandParamType.Float
            }
        ]
    },
    (origin, target: Entity[], rotationX: number, rotationY: number) => {
        system.run(() => {
            for (const entity of target) {
                entity.setRotation({ x: rotationX, y: rotationY });
            }
        });
        return { status: CustomCommandStatus.Success };
    }
);
