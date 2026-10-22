/* SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Licensed under the PolyForm Noncommercial License 1.0.0.
 * You may use, modify, and redistribute this software for permitted
 * noncommercial purposes, subject to the terms of that license.
 *
 * Commercial use requires separate authorization from the applicable
 * copyright holder.
 *
 * The complete license text is available at:
 * https://polyformproject.org/licenses/noncommercial/1.0.0
 */

import {
    CommandPermissionLevel,
    CustomCommandParamType,
    CustomCommandStatus,
    Entity,
    system,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "extinguish",
        description: "Extinguishes fire",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        optionalParameters: [
            { name: "targets", type: CustomCommandParamType.EntitySelector },
            { name: "useEffects", type: CustomCommandParamType.Boolean },
        ],
    },
    (origin, targets: Entity[], useEffects: boolean = true) => {
        if (!targets) {
            system.run(() => {
                origin.sourceEntity?.extinguishFire();
            });
            return { status: CustomCommandStatus.Success, message: `Self extinguished` };
        }

        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            for (const entity of targets) {
                entity.extinguishFire(useEffects);
            }
        });

        return {
            status: CustomCommandStatus.Success,
            message: `${targets.length} Targets extinguished`,
        };
    }
);
