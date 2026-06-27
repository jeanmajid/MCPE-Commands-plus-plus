import {
    CommandPermissionLevel,
    CustomCommandStatus,
    system,
    CustomCommandParamType,
} from "@minecraft/server";

import { Vector } from "../../utils/vector.js";
import { CommandManager } from "../command.js";

CommandManager.registerCommand(
    {
        name: "block",
        description: "Places a block at the current position",
        permissionLevel: CommandPermissionLevel.Admin,
        optionalParameters: [{ name: "blockType", type: CustomCommandParamType.BlockType }],
    },
    (origin, blockType: string = "minecraft:glass") => {
        if (!origin.sourceEntity) {
            return;
        }
        const dimension = origin.sourceEntity.dimension;
        const location = origin.sourceEntity.location;
        system.run(() => {
            dimension.setBlockType(location, blockType);
        });
        return {
            status: CustomCommandStatus.Success,
            message: `${blockType} placed successully at ${Vector.toStringFloored(location)}`,
        };
    }
);
