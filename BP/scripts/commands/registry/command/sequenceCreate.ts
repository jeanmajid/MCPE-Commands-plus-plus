import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { FMResult, FUNCTION_MANAGER } from "../../managers/functionsManager.js";

CommandManager.register(
    {
        name: "sequencecreate",
        description: "",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "sequenceName", type: CustomCommandParamType.String }],
    },
    (origin, sequenceName: string) => {
        const status = FUNCTION_MANAGER.createC(sequenceName);

        switch (status) {
            case FMResult.Success:
                return {
                    status: CustomCommandStatus.Success,
                    message: "Successfully created <sequence>/" + sequenceName,
                };

            case FMResult.InvalidName:
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Sequence name contains invalid characters",
                };

            case FMResult.NameCollision:
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Sequence with this name already exists, <sequence>/" + sequenceName,
                };
        }

        return {
            status: CustomCommandStatus.Failure,
            message: "Unexpected bug, report this issue to github repository",
        };
    }
);
