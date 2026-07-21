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
    Vector3,
    Block,
    Player,
} from "@minecraft/server";

import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "blockstates",
        description:
            "Lists all block states for the either the block being viewed or the block at the specified position",
        permissionLevel: CommandPermissionLevel.Admin,
        optionalParameters: [{ name: "position", type: CustomCommandParamType.Location }],
    },
    (origin, position: Vector3) => {
        if (!(origin?.sourceEntity instanceof Player)) {
            return;
        }

        let block: Block | undefined;
        if (!position) {
            block = origin.sourceEntity.getBlockFromViewDirection()?.block;
            if (!block) {
                return { status: CustomCommandStatus.Failure, message: "No block found in view" };
            }
        } else {
            const dimension = origin.sourceEntity.dimension;
            try {
                block = dimension.getBlock(position);
            } catch {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Cannot get block outside of world",
                };
            }
        }

        if (!block?.isValid) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Cannot get block outside of world",
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
        return { status: CustomCommandStatus.Success, message: "" };
    }
);
