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
    ItemStack,
    ItemType,
    system,
} from "@minecraft/server";

import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { clamp } from "../../../utils/math.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "spawnitem",
        description: "Summons an item entity",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "item", type: CustomCommandParamType.ItemType },
            { name: "location", type: CustomCommandParamType.Location },
        ],
        optionalParameters: [{ name: "quantity", type: CustomCommandParamType.Integer }],
    },
    (origin, item: ItemType, location: Vector3, quantity: number = 1) => {
        const dimension = getDimensionFromCommandOrigin(origin);
        quantity = clamp(quantity, 1, 255);

        const itemStack = new ItemStack(item, quantity);

        system.run(() => {
            dimension.spawnItem(itemStack, location);
        });

        return {
            status: CustomCommandStatus.Success,
            message: `Summoned %${item.localizationKey} * ${quantity}`,
        };
    }
);
