import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Vector3
} from "@minecraft/server";
import { CommandManager } from "../command.js";
import { DebugLine, debugDrawer } from "@minecraft/debug-utilities";
import { getNormalizedRgb } from "../../utils/color.js";

CommandManager.registerCommand(
    {
        name: "drawline",
        description: "Draws a line via the Debug Drawer",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "startPos",
                type: CustomCommandParamType.Location
            },
            {
                name: "endPos",
                type: CustomCommandParamType.Location
            },
            {
                name: "id",
                type: CustomCommandParamType.String
            }
        ],
        optionalParameters: [
            {
                name: "colorRed",
                type: CustomCommandParamType.Integer
            },
            {
                name: "colorGreen",
                type: CustomCommandParamType.Integer
            },
            {
                name: "colorBlue",
                type: CustomCommandParamType.Integer
            },
            {
                name: "expirationTicks",
                type: CustomCommandParamType.Integer
            }
        ]
    },
    (
        origin,
        startPos: Vector3,
        endPos: Vector3,
        id: string,
        colorRed: number,
        colorGreen: number,
        colorBlue: number,
        expirationTicks: number
    ) => {
        const line = new DebugLine(startPos, endPos);
        if (colorBlue !== undefined) {
            line.color = getNormalizedRgb(colorRed, colorGreen, colorBlue);
        }
        if (expirationTicks !== undefined) {
            line.timeLeft = expirationTicks;
        }
        debugDrawer.addShape(line);
        return { status: CustomCommandStatus.Success, message: "Line successfully drawn" };
    }
);
