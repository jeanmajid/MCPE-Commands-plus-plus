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
    system,
    CustomCommandParamType,
    BlockType,
    BlockTypes,
} from "@minecraft/server";

import { Vector } from "../../../utils/vector.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "block",
        aliases: ["b"],
        description: "Places a block at the current position",
        permissionLevel: CommandPermissionLevel.Admin,
        optionalParameters: [{ name: "blockType", type: CustomCommandParamType.BlockType }],
    },
    (origin, blockType: BlockType = BlockTypes.get("minecraft:glass")!) => {
        if (!origin.sourceEntity) {
            return;
        }
        const dimension = origin.sourceEntity.dimension;
        const location = origin.sourceEntity.location;
        system.run(() => {
            dimension.setBlockType(location, blockType);
        });
        return {
            status: CustomCommandStatus.Success,
            message: `${blockType.id} placed successfully at ${Vector.toStringFloored(location)}`,
        };
    }
);
