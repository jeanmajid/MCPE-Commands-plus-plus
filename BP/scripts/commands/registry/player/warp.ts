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
    system,
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

CommandManager.registerCommand(
    {
        name: "warp",
        description: "Teleport to a warp",
        permissionLevel: CommandPermissionLevel.Any,

        mandatoryParameters: [{ name: "name", type: CustomCommandParamType.String }],
    },

    (origin, name: string) => {
        const player = origin.sourceEntity;

        if (!(player instanceof Player)) {
            return {
                status: CustomCommandStatus.Failure,
                message: "This command must be run by a player.",
            };
        }

        const warps = getWarps();

        const savedWarp = warps.find((warp) => warp.name.toLowerCase() === name.toLowerCase());

        if (!savedWarp) {
            return {
                status: CustomCommandStatus.Failure,
                message: `Warp "${name}" does not exist.`,
            };
        }

        const location = {
            x: savedWarp.location.x,
            y: savedWarp.location.y,
            z: savedWarp.location.z,
        };

        system.run(() => {
            player.teleport(location);
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Teleported to warp "${savedWarp.name}".`,
        };
    }
);
