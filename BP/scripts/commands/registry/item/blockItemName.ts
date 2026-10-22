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
    CustomCommandOrigin,
    CustomCommandResult,
    ContainerSlot,
} from "@minecraft/server";

import {
    BLOCK_ITEM_LOCATIONS_ENUM_KEY,
    BlockItemLocations,
} from "../../../enums/registry/blockItemLocation.js";
import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { CommandManager } from "../../command.js";
import { renameItemAtSlot } from "./itemName.js";

CommandManager.register(
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
    if (slot !== BlockItemLocations.SlotContainer) {
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
