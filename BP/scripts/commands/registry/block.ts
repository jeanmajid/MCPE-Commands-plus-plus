import {
    CommandPermissionLevel,
    CustomCommandStatus,
    system,
    CustomCommandParamType
} from "@minecraft/server";
import { CommandManager } from "../command.js";
import { Vector } from "../../utils/vector.js";

CommandManager.registerCommand(
    {
        name: "block",
        description: "Places a block at the current position",
        permissionLevel: CommandPermissionLevel.Admin,
        optionalParameters: [
            {
                name: "blockType",
                type: CustomCommandParamType.BlockType
            }
        ]
    },
    (origin, blockType: string = "minecraft:glass") => {
        const dimension = origin.sourceEntity.dimension;
        const location = origin.sourceEntity.location;
        system.run(() => {
            dimension.setBlockType(location, blockType);
        });
        return {
            status: CustomCommandStatus.Success,
            message: `${blockType} placed successully at ${Vector.toStringFloored(location)}`
        };
    }
);
