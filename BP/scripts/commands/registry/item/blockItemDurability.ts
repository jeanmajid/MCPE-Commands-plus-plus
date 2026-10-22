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
import {
    VALUE_UPDATE_MODE_ENUM_KEY,
    ValueUpdateMode,
} from "../../../enums/registry/valueUpdateMode.js";
import { CommandManager } from "../../command.js";
import { getBlockContainerSlot } from "./blockItemName.js";
import { updateItemDurabilityAtSlot } from "./itemDurability.js";

CommandManager.register(
    {
        name: "blockitemdurability",
        description: "Modifies the durability of the item at the provided slot within a container",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "mode",
                type: CustomCommandParamType.Enum,
                enumName: VALUE_UPDATE_MODE_ENUM_KEY,
            },
            { name: "location", type: CustomCommandParamType.Location },
            {
                name: "slot",
                type: CustomCommandParamType.Enum,
                enumName: BLOCK_ITEM_LOCATIONS_ENUM_KEY,
            },
            { name: "index", type: CustomCommandParamType.Integer },
            { name: "amount", type: CustomCommandParamType.Integer },
        ],
    },
    (
        origin,
        mode: ValueUpdateMode,
        location: Vector3,
        slot: string,
        index: number,
        amount: number
    ) => {
        const itemSlotResult = getBlockContainerSlot(origin, location, slot, index);

        if (!(itemSlotResult instanceof ContainerSlot)) {
            return itemSlotResult;
        }

        const item = itemSlotResult.getItem();
        if (!item) {
            return { status: CustomCommandStatus.Failure, message: "No item at destination" };
        }

        updateItemDurabilityAtSlot(item, itemSlotResult, mode, amount);

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully modified durability of item at slot",
        };
    }
);
