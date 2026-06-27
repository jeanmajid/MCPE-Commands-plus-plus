import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    world,
    system,
} from "@minecraft/server";

import { CommandManager } from "../command.js";
import { AttributeManager } from "./../../attributes/attribute";

CommandManager.registerEnum("bind", ["health"]);

CommandManager.registerCommand(
    {
        name: "bind",
        description: "Bind an attribute to a score",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "jm:bind", type: CustomCommandParamType.Enum },
            { name: "scoreboardId", type: CustomCommandParamType.String },
        ],
    },
    (origin, attributeId: string, scoreboardId: string) => {
        const attribute = AttributeManager.getAttribute(attributeId);
        if (!attribute) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} does not exist`,
            };
        }
        if (attribute.isBinded) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} is already binded to ${attribute.score.id}`,
            };
        }

        system.run(() => {
            world.setDynamicProperty(`attribute:${attributeId}`, scoreboardId);
            const objective =
                world.scoreboard.getObjective(scoreboardId) ||
                world.scoreboard.addObjective(scoreboardId);

            attribute.isBinded = true;
            attribute.score = objective;
            attribute.initialize();
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Successfully binded ${attributeId} to score ${scoreboardId}`,
        };
    }
);
