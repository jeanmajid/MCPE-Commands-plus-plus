import {
    CommandPermissionLevel,
    CustomCommandStatus,
    system,
    CustomCommandParamType,
    world
} from "@minecraft/server";
import { CommandManager } from "../command.js";

const ranCommands: Map<string, string> = new Map();

CommandManager.registerCommand(
    {
        name: "delay",
        description: "Delays the execution of a command",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "id",
                type: CustomCommandParamType.String
            },
            {
                name: "delayInTicks",
                type: CustomCommandParamType.Integer
            },
            {
                name: "command",
                type: CustomCommandParamType.String
            }
        ]
    },
    (origin, id: string, delayInTicks: number, command: string) => {
        if (ranCommands.has(id)) {
            return { status: CustomCommandStatus.Failure, message: "" };
        }
        ranCommands.set(id, command);

        system.runTimeout(() => {
            world.getDimension("overworld").runCommand(command);
            ranCommands.delete(id);
        }, delayInTicks);

        return { status: CustomCommandStatus.Success, message: "" };
    }
);
