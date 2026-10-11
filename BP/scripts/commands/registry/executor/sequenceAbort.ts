import { CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";

import { CommandManager } from "../../command.js";

let isCurrentlyRunning = false;
export function setIsRunning(isRunning: boolean): void {
    isCurrentlyRunning = isRunning;
}

export function getIsRunning(): boolean {
    return isCurrentlyRunning;
}
CommandManager.register(
    {
        name: "sequenceabort",
        aliases: ["seqabort"],
        description: "Early exit in currently running sequence",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [],
    },
    () => {
        if (!isCurrentlyRunning) {
            return {
                status: CustomCommandStatus.Failure,
                message: "No sequence is currently running",
            };
        }

        isCurrentlyRunning = false;
        return { status: CustomCommandStatus.Success, message: "Returned early" };
    }
);
