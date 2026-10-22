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

// ${player.name} ${score.health}

import {
    CommandPermissionLevel,
    CustomCommandStatus,
    system,
    CustomCommandParamType,
    Entity,
    Player,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "nametag",
        description: "Set nametag of entities",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.EntitySelector },
            { name: "nametag", type: CustomCommandParamType.String },
        ],
    },
    (origin, targets: Entity[], nameTag: string) => {
        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        system.run(() => {
            for (const entity of targets) {
                try {
                    entity.nameTag = nameTag
                        .replace(/{n}/g, "\n")
                        .replace(/{name}/g, (entity as Player).name ?? "default");
                } catch {
                    // skip
                }
            }
        });
        return { status: CustomCommandStatus.Success, message: "Sucessfully changed nametags" };
    }
);
