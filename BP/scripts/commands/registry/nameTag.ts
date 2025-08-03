// ${player.name} ${score.health}

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
        name: "nametag",
        description: "Set nametag of entities",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "targets",
                type: CustomCommandParamType.EntitySelector
            },
            {
                name: "nametag",
                type: CustomCommandParamType.String
            }
        ]
    },
    (origin, targets: Entity[], nameTag: string) => {
        system.run(() => {
            for (const entity of targets) {
                try {
                    entity.nameTag = nameTag
                        .replace(/{n}/g, "\n")
                        .replace(/{name}/g, (entity as Player).name ?? "default");
                } catch {
                    // skip
                }
            }
        });
        return { status: CustomCommandStatus.Success, message: "Sucessfully changed nametags" };
    }
);
