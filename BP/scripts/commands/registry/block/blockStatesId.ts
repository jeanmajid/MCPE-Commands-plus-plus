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
    BlockPermutation,
    BlockType,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.registerCommand(
    {
        name: "blockstatesid",
        description: "Lists all default block state values for the provided block",
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [{ name: "blockId", type: CustomCommandParamType.BlockType }],
    },
    (origin, blockType: BlockType) => {
        if (!(origin?.sourceEntity instanceof Player)) {
            return;
        }

        const id = blockType.id;
        const permutation = BlockPermutation.resolve(id);
        const states = permutation.getAllStates();

        const stateStrings = [];
        for (const key in states) {
            stateStrings.push(`§a${key}§7: §f${states[key]}`);
        }

        origin.sourceEntity.sendMessage(
            `The block (${id}) ${stateStrings.length === 0 ? "§fhas no states" : `§fhas the following default Block States:\n${stateStrings.join("\n")}`}`
        );
        return { status: CustomCommandStatus.Success };
    }
);
