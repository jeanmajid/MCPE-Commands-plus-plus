import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { FMResult, FUNCTION_MANAGER } from "../../managers/functionsManager.js";

CommandManager.register(
    {
        name: "sequencedelete",
        description: "Deletes specified sequence",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "sequenceName", type: CustomCommandParamType.String }],
    },
    (origin, sequenceName: string) => {
        const status = FUNCTION_MANAGER.deleteC(sequenceName);

        switch (status) {
            case FMResult.Success:
                return {
                    status: CustomCommandStatus.Success,
                    message: "Successfully deleted <sequence>/" + sequenceName,
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
