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
    Player,
    world,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

interface Warp {
    name: string;
    location: { x: number; y: number; z: number };
}

function getWarps(): Warp[] {
    const data = world.getDynamicProperty("warps");

    if (typeof data !== "string") {
        return [];
    }

    try {
        return JSON.parse(data) as Warp[];
    } catch {
        return [];
    }
}

function saveWarps(warps: Warp[]): void {
    world.setDynamicProperty("warps", JSON.stringify(warps));
}

CommandManager.registerEnum("warpconfig_action", ["add", "remove", "list"]);

CommandManager.registerCommand(
    {
        name: "warpconfig",
        description: "Manage warps",
        permissionLevel: CommandPermissionLevel.GameDirectors,

        mandatoryParameters: [
            { name: "action", type: CustomCommandParamType.Enum, enumName: "warpconfig_action" },
        ],

        optionalParameters: [{ name: "name", type: CustomCommandParamType.String }],
    },

    (origin, action: string, name?: string) => {
        const player = origin.sourceEntity;

        if (!(player instanceof Player)) {
            return {
                status: CustomCommandStatus.Failure,
                message: "This command must be run by a player.",
            };
        }

        const warps = getWarps();

        if (action === "add") {
            if (!name) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Usage: /warpconfig add <name>",
                };
            }

            if (warps.some((warp) => warp.name === name)) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: `Warp "${name}" already exists.`,
                };
            }

            warps.push({
                name,
                location: { x: player.location.x, y: player.location.y, z: player.location.z },
            });

            saveWarps(warps);

            return {
                status: CustomCommandStatus.Success,
                message: `Successfully created warp "${name}".`,
            };
        }

        if (action === "remove") {
            if (!name) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Usage: /warpconfig remove <name>",
                };
            }

            const index = warps.findIndex((warp) => warp.name === name);

            if (index === -1) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: `Warp "${name}" does not exist.`,
                };
            }

            warps.splice(index, 1);

            saveWarps(warps);

            return {
                status: CustomCommandStatus.Success,
                message: `Successfully removed warp "${name}".`,
            };
        }

        if (action === "list") {
            if (warps.length === 0) {
                return { status: CustomCommandStatus.Success, message: "There are no warps." };
            }

            return {
                status: CustomCommandStatus.Success,
                message: `Warps: ${warps.map((warp) => warp.name).join(", ")}`,
            };
        }

        return { status: CustomCommandStatus.Failure, message: "Invalid action." };
    }
);
