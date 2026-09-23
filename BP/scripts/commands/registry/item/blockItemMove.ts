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
} from "@minecraft/server";

import { getDimensionFromCommandOrigin } from "../../../utils/dimension.js";
import { numberInRange } from "../../../utils/number.js";
import { CommandManager } from "../../command.js";
import { BLOCK_ITEM_LOCATIONS_ENUM_KEY, BlockItemLocations } from "./blockItemName.js";
import { ITEM_MOVE_MODE_ENUM_KEY, ItemMoveMode, moveItemAtSlot } from "./itemMove.js";

CommandManager.registerCommand(
    {
        name: "blockitemmmove",
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
        if (sourceSlot !== BlockItemLocations.slotContainer) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Invalid source container slot location",
            };
        }
        if (destinationSlot !== BlockItemLocations.slotContainer) {
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
