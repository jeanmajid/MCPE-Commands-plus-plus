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
} from "@minecraft/server";

import {
    BLOCK_ITEM_LOCATIONS_ENUM_KEY,
    BlockItemLocations,
} from "../../../enums/registry/blockItemLocation.js";
import { ITEM_MOVE_MODE_ENUM_KEY, ItemMoveMode } from "../../../enums/registry/itemMoveMode.js";
import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { numberInRange } from "../../../utils/number.js";
import { CommandManager } from "../../command.js";
import { moveItemAtSlot } from "./itemMove.js";

CommandManager.register(
    {
        name: "blockitemmove",
        description: "Moves an item from one provided slot within a container to another",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "location", type: CustomCommandParamType.Location },
            {
                name: "sourceSlot",
                type: CustomCommandParamType.Enum,
                enumName: BLOCK_ITEM_LOCATIONS_ENUM_KEY,
            },
            { name: "sourceIndex", type: CustomCommandParamType.Integer },
            {
                name: "destinationSlot",
                type: CustomCommandParamType.Enum,
                enumName: BLOCK_ITEM_LOCATIONS_ENUM_KEY,
            },
            { name: "destinationIndex", type: CustomCommandParamType.Integer },
        ],
        optionalParameters: [
            {
                name: "moveMode",
                type: CustomCommandParamType.Enum,
                enumName: ITEM_MOVE_MODE_ENUM_KEY,
            },
            { name: "replaceItem", type: CustomCommandParamType.Boolean },
        ],
    },
    (
        origin,
        location: Vector3,
        sourceSlot: string,
        sourceIndex: number,
        destinationSlot: string,
        destinationIndex: number,
        moveMode: ItemMoveMode,
        replaceItem: boolean
    ) => {
        if (sourceSlot !== BlockItemLocations.SlotContainer) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Invalid source container slot location",
            };
        }
        if (destinationSlot !== BlockItemLocations.SlotContainer) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Invalid destination container slot location",
            };
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
        if (!numberInRange(sourceIndex, 0, containerSize)) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Source index must be between 0 and " + containerSize,
            };
        }
        if (!numberInRange(sourceIndex, 0, containerSize)) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Destination index must be between 0 and " + containerSize,
            };
        }

        const sourceItemSlot = container.getSlot(sourceIndex);
        const destinationItemSlot = container.getSlot(destinationIndex);

        moveItemAtSlot(sourceItemSlot, destinationItemSlot, moveMode, replaceItem);

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully moved items between slots",
        };
    }
);
