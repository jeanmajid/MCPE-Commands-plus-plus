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
    CustomCommandOrigin,
    CustomCommandResult,
    ContainerSlot,
} from "@minecraft/server";

import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { CommandManager } from "../../command.js";
import { renameItemAtSlot } from "./itemName.js";

export const BLOCK_ITEM_LOCATIONS_ENUM_KEY = "blockItemLocationsEnum";
export enum BlockItemLocations {
    slotContainer = "slot.container",
}

CommandManager.registerEnum(BLOCK_ITEM_LOCATIONS_ENUM_KEY, Object.values(BlockItemLocations));

CommandManager.registerCommand(
    {
        name: "blockitemname",
        description: "Renames the item at the provided slot within a container",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "location", type: CustomCommandParamType.Location },
            {
                name: "slot",
                type: CustomCommandParamType.Enum,
                enumName: BLOCK_ITEM_LOCATIONS_ENUM_KEY,
            },
            { name: "index", type: CustomCommandParamType.Integer },
            { name: "name", type: CustomCommandParamType.String },
        ],
    },
    (origin, location: Vector3, slot: string, index: number, name: string) => {
        const itemSlotResult = getBlockContainerSlot(origin, location, slot, index);

        if (!(itemSlotResult instanceof ContainerSlot)) {
            return itemSlotResult;
        }

        const item = itemSlotResult.getItem();
        if (!item) {
            return { status: CustomCommandStatus.Failure, message: "No item at destination" };
        }

        renameItemAtSlot(item, itemSlotResult, name);

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully renamed item at slot",
        };
    }
);

export function getBlockContainerSlot(
    origin: CustomCommandOrigin,
    location: Vector3,
    slot: string,
    index: number
): CustomCommandResult | ContainerSlot {
    if (slot !== BlockItemLocations.slotContainer) {
        return { status: CustomCommandStatus.Failure, message: "Invalid container slot location" };
    }

    const dimension = getDimensionFromCommandOrigin(origin);
    if (!dimension.isChunkLoaded(location)) {
        return {
            status: CustomCommandStatus.Failure,
            message: "Cannot access block outside the world",
        };
    }

    const block = dimension.getBlock(location);
    if (!block) {
        return {
            status: CustomCommandStatus.Failure,
            message: "Cannot access block for an unknown reason",
        };
    }

    const container = block.getComponent("minecraft:inventory")?.container;
    if (!container) {
        return { status: CustomCommandStatus.Failure, message: "Block is not a container" };
    }

    const containerSize = container.size - 1;
    if (index > containerSize || index < 0) {
        return {
            status: CustomCommandStatus.Failure,
            message: "Index must be between 0 and " + containerSize,
        };
    }

    return container.getSlot(index);
}
