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
    Player,
    BlockPermutation,
    BlockType,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

CommandManager.register(
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
