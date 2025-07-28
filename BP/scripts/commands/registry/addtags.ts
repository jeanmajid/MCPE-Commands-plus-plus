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
        name: "addtags",
        description: "Adds an array of provided tags to the targets",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "targets",
                type: CustomCommandParamType.EntitySelector
            },
            {
                name: "tags",
                type: CustomCommandParamType.String
            }
        ]
    },
    (origin, targets: Entity[], tags: string) => {
        system.run(() => {
            for (const entity of targets) {
                const selectorTags = tags.split(/[, ]/g).filter((t) => t !== "");
                for (const tag of selectorTags) {
                    entity.addTag(tag);
                }
            }
        });
        return {
            status: CustomCommandStatus.Success,
            message: `Added [${tags}] to ${targets.length} entities`
        };
    }
);
