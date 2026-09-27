import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { FMResult, FUNCTION_MANAGER } from "../../managers/functionsManager.js";

CommandManager.register(
    {
        name: "sequenceinsert",
        description: "Inserts new commands to the sequences at specified line",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "sequenceName", type: CustomCommandParamType.String },
            { name: "command", type: CustomCommandParamType.String },
        ],
        optionalParameters: [{ name: "line", type: CustomCommandParamType.Integer }],
    },
    (origin, sequenceName: string, command: string, line?: number) => {
        if (line !== undefined) {
            line -= 1; // map to index

            if (line < 0) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Line has to be positive integer",
                };
            }
        }

        const status = FUNCTION_MANAGER.insertC(sequenceName, command, line);

        switch (status) {
            case FMResult.Success:
                return {
                    status: CustomCommandStatus.Success,
                    message: "Successfully inserted command into the <sequence>/" + sequenceName,
                };

            case FMResult.InvalidName:
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Sequence name contains invalid characters",
                };

            case FMResult.NotFound:
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Sequence with this name doesn't exists, <sequence>/" + sequenceName,
                };
        }

        return {
            status: CustomCommandStatus.Failure,
            message: "Unexpected bug, report this issue to github repository",
        };
    }
);
