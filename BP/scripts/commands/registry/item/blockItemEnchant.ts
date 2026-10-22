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
    ContainerSlot,
} from "@minecraft/server";

import { BLOCK_ITEM_LOCATIONS_ENUM_KEY } from "../../../enums/registry/blockItemLocation.js";
import { ENCHANTMENT_ENUM_KEY } from "../../../enums/registry/enchantment.js";
import { CommandManager } from "../../command.js";
import { getBlockContainerSlot } from "./blockItemName.js";
import { enchantItemAtSlot } from "./itemEnchant.js";

CommandManager.register(
    {
        name: "blockitemenchant",
        description: "Enchants the item at the provided slot within a container",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "location", type: CustomCommandParamType.Location },
            {
                name: "slot",
                type: CustomCommandParamType.Enum,
                enumName: BLOCK_ITEM_LOCATIONS_ENUM_KEY,
            },
            { name: "index", type: CustomCommandParamType.Integer },
            { name: "enchant", type: CustomCommandParamType.Enum, enumName: ENCHANTMENT_ENUM_KEY },
        ],
        optionalParameters: [{ name: "level", type: CustomCommandParamType.Integer }],
    },
    (
        origin,
        location: Vector3,
        slot: string,
        index: number,
        enchant: string,
        level: number = 1
    ) => {
        const itemSlotResult = getBlockContainerSlot(origin, location, slot, index);

        if (!(itemSlotResult instanceof ContainerSlot)) {
            return itemSlotResult;
        }

        const item = itemSlotResult.getItem();
        if (!item) {
            return { status: CustomCommandStatus.Failure, message: "No item at destination" };
        }

        enchantItemAtSlot(item, itemSlotResult, enchant, level);

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully enchanted item at slot",
        };
    }
);
