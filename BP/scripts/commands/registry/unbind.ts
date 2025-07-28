import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    world,
    system
} from "@minecraft/server";
import { CommandManager } from "../command.js";
import { AttributeManager } from "./../../attributes/attribute";

CommandManager.registerCommand(
    {
        name: "unbind",
        description: "unbind an attribute",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "jm:bind",
                type: CustomCommandParamType.Enum
            }
        ]
    },
    (origin, attributeId: string) => {
        const attribute = AttributeManager.getAttribute(attributeId);
        if (!attribute) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} does not exist`
            };
        }
        if (!attribute.isBinded) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Attribute ${attributeId} isn't binded`
            };
        }

        system.run(() => {
            world.setDynamicProperty(`attribute:${attributeId}`, undefined);
            attribute.cleanup();
            world.scoreboard.removeObjective(attribute.score);

            attribute.isBinded = false;
            attribute.score = undefined;
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Successfully unbinded ${attributeId}`
        };
    }
);
