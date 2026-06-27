/* SPDX-License-Identifier: GPL-3.0-or-later
 * ============================================================================
 * Commands Plus Plus
 * Copyright (C) 2024-2026 jeanmajid and contributors
 * https://github.com/jeanmajid/MCPE-Commands-plus-plus
 * ============================================================================
 *
 * This file is part of Commands Plus Plus.
 *
 * Commands Plus Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Commands Plus Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Commands Plus Plus. If not, see <https://www.gnu.org/licenses/>.
 */

import {
    CommandPermissionLevel,
    CustomCommandStatus,
    CustomCommandParamType,
    Entity,
    system,
} from "@minecraft/server";

import { CommandManager } from "../command.js";

CommandManager.registerCommand(
    {
        name: "addtags",
        description: "Adds an array of provided tags to the targets",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.EntitySelector },
            { name: "tags", type: CustomCommandParamType.String },
        ],
    },
    (origin, targets: Entity[], tags: string) => {
        system.run(() => {
            for (const entity of targets) {
                const selectorTags = tags.split(/[, ]/g).filter((t) => t !== "");
                for (const tag of selectorTags) {
                    entity.addTag(tag);
                }
            }
        });
        return {
            status: CustomCommandStatus.Success,
            message: `Added [${tags}] to ${targets.length} entities`,
        };
    }
);
