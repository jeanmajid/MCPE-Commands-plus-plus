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
        name: "top",
        description: "Teleports the target to the top most block at their position",
        permissionLevel: CommandPermissionLevel.GameDirectors,

        optionalParameters: [
            {
                name: "target",
                type: CustomCommandParamType.EntitySelector
            },
            {
                name: "minHeight",
                type: CustomCommandParamType.Float
            }
        ]
    },
    (origin, target: Entity[], minHeight: number) => {
        system.run(() => {
            if (!target && origin.sourceEntity) {
                teleportEntityToTop(origin.sourceEntity, minHeight);
                return;
            }
            for (const entity of target) {
                teleportEntityToTop(entity, minHeight);
            }
        });
        return { status: CustomCommandStatus.Success, message: "Sucessfully teleported entities" };
    }
);

function teleportEntityToTop(entity: Entity, minHeight: number): void {
    const { x, y, z } = entity.location;
    const topBlock = entity.dimension.getTopmostBlock({ x, z }, minHeight);
    if (!topBlock || topBlock.y <= y) {
        return;
    }
    entity.teleport({ x, y: topBlock.y + 1, z });
}
