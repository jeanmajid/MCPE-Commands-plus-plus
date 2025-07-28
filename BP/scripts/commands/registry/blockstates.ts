import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Vector3,
    Block,
    Player
} from "@minecraft/server";
import { CommandManager } from "../command.js";
import { Vector } from "../../utils/vector.js";

CommandManager.registerCommand(
    {
        name: "blockstates",
        description:
            "Lists all block states for the either the block being viewed or the block at the specified position",
        permissionLevel: CommandPermissionLevel.Admin,
        optionalParameters: [
            {
                name: "position",
                type: CustomCommandParamType.Location
            }
        ]
    },
    (origin, position: Vector3) => {
        if (!(origin?.sourceEntity instanceof Player)) {
            return;
        }
        let block: Block;
        if (!position) {
            block = origin.sourceEntity.getBlockFromViewDirection()?.block;
            if (!block) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "No block found in view"
                };
            }
        } else {
            const dimension = origin.sourceEntity.dimension;
            try {
                block = dimension.getBlock(position);
            } catch {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Cannot get block outside of world"
                };
            }
        }
        if (!block?.isValid) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Cannot get block outside of world"
            };
        }
        const states = block.permutation.getAllStates();
        const stateStrings = [];
        for (const key in states) {
            stateStrings.push(`§a${key}§7: §f${states[key]}`);
        }

        origin.sourceEntity.sendMessage(
            `The block (${block.typeId}) at §7${Vector.toString(block.location)} ${stateStrings.length === 0 ? "§fhas no states" : `§fhas the following Block States:\n${stateStrings.join("\n")}`}`
        );
        return {
            status: CustomCommandStatus.Success,
            message: ""
        };
    }
);
