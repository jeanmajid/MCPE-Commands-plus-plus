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
    Vector3,
    Block,
    Player,
} from "@minecraft/server";

import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "blockstates",
        description:
            "Lists all block states for either the block being viewed or the block at the specified position",
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
