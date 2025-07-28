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
        name: "removetags",
        description: "Removes an array of provided tags from the targets",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "targets",
                type: CustomCommandParamType.EntitySelector
            }
        ],
        optionalParameters: [
            {
                name: "tags",
                type: CustomCommandParamType.String
            }
        ]
    },
    (origin, targets: Entity[], tags: string) => {
        if (!tags) {
            system.run(() => {
                for (const entity of targets) {
                    const entityTags = entity.getTags();
                    for (const tag of entityTags) {
                        entity.removeTag(tag);
                    }
                }
            });
            return {
                status: CustomCommandStatus.Success,
                message: `All tags removed from ${targets.length} entities`
            };
        }

        system.run(() => {
            for (const entity of targets) {
                const selectorTags = tags.split(/[, ]/g).filter((t) => t !== "");
                const entityTags = entity.getTags();
                for (const tag of entityTags) {
                    if (selectorTags.includes(tag)) {
                        entity.removeTag(tag);
                    }
                }
            }
        });
        return {
            status: CustomCommandStatus.Success,
            message: `Removed [${tags}] from ${targets.length} entities`
        };
    }
);
