// ${player.name} ${score.health}

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
                    entity.nameTag = nameTag;
                } catch {
                    // skip
                }
            }
        });
        return { status: CustomCommandStatus.Success };
    }
);
