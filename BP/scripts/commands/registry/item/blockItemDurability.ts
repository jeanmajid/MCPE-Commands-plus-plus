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
    ContainerSlot,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { VALUE_UPDATE_MODE_ENUM_KEY, ValueUpdateMode } from "../entity/health.js";
import { BLOCK_ITEM_LOCATIONS_ENUM_KEY, getBlockContainerSlot } from "./blockItemName.js";
import { updateItemDurabilityAtSlot } from "./itemDurability.js";

CommandManager.register(
    {
        name: "blockitemdurability",
        description: "Modifies the durability of the item at the provided slot within a container",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            {
                name: "mode",
                type: CustomCommandParamType.EntityType,
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
