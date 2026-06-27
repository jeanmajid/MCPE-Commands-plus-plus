import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    Entity,
    system,
} from "@minecraft/server";

import { CommandManager } from "../command.js";

CommandManager.registerCommand(
    {
        name: "setonfire",
        description: "Sets the target entities on fire",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "targets", type: CustomCommandParamType.EntitySelector }],
        optionalParameters: [
            { name: "timeSeconds", type: CustomCommandParamType.Float },
            { name: "useEffects", type: CustomCommandParamType.Boolean },
        ],
    },
    (origin, targets: Entity[], timeSeconds: number = 3, useEffects: boolean = true) => {
        system.run(() => {
            for (const entity of targets) {
                entity.setOnFire(timeSeconds, useEffects);
            }
        });

        return { status: CustomCommandStatus.Success, message: `Set targets on fire` };
    }
);
