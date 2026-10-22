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
        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            for (const entity of targets) {
                entity.setOnFire(timeSeconds, useEffects);
            }
        });

        return { status: CustomCommandStatus.Success, message: `Set targets on fire` };
    }
);
