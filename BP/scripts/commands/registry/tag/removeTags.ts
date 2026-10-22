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
    CustomCommandStatus,
    CustomCommandParamType,
    Entity,
    system,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "removetags",
        description: 'Removes an array of provided tags from the targets written as "a, b, c"',
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [{ name: "targets", type: CustomCommandParamType.EntitySelector }],
        optionalParameters: [{ name: "tags", type: CustomCommandParamType.String }],
    },
    (origin, targets: Entity[], tags: string) => {
        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        if (!tags) {
            system.run(() => {
                for (const entity of targets) {
                    const entityTags = entity.getTags();
                    for (const tag of entityTags) {
                        entity.removeTag(tag);
                    }
                }
            });
            return {
                status: CustomCommandStatus.Success,
                message: `All tags removed from ${targets.length} entities`,
            };
        }

        system.run(() => {
            for (const entity of targets) {
                const selectorTags = tags.split(/[, ]/g).filter((t) => t !== "");
                const entityTags = entity.getTags();
                for (const tag of entityTags) {
                    if (selectorTags.includes(tag)) {
                        entity.removeTag(tag);
                    }
                }
            }
        });
        return {
            status: CustomCommandStatus.Success,
            message: `Removed [${tags}] from ${targets.length} entities`,
        };
    }
);
