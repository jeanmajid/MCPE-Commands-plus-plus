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
    Entity,
    ContainerSlot,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { BLOCK_ITEM_LOCATIONS_ENUM_KEY, getBlockContainerSlot } from "./blockItemName.js";
import { ITEM_MOVE_MODE_ENUM_KEY, ItemMoveMode, moveItemAtSlot } from "./itemMove.js";
import { ItemLocations } from "./itemName.js";

CommandManager.register(
    {
        name: "containertake",
        description: "Moves an item from one provided slot within a container to another",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "sourceEntity", type: CustomCommandParamType.EntitySelector },
            {
                name: "sourceSlot",
                type: CustomCommandParamType.Enum,
                enumName: BLOCK_ITEM_LOCATIONS_ENUM_KEY,
            },
            { name: "sourceIndex", type: CustomCommandParamType.Integer },
            { name: "destinationLocation", type: CustomCommandParamType.Location },
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
        sourceEntity: Entity[],
        sourceSlot: string,
        sourceIndex: number,
        destinationLocation: Vector3,
        destinationSlot: string,
        destinationIndex: number,
        moveMode: ItemMoveMode,
        replaceItem: boolean
    ) => {
        if (sourceEntity.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        const destinationItemSlotResult = getBlockContainerSlot(
            origin,
            destinationLocation,
            sourceSlot,
            sourceIndex
        );

        if (!(destinationItemSlotResult instanceof ContainerSlot)) {
            return destinationItemSlotResult;
        }

        const destinationItemSlot = ItemLocations[destinationSlot];
        if (!destinationItemSlot) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Invalid destination item slot",
            };
        }

        let commandSuccess = false;
        for (const target of sourceEntity) {
            const sourceItemSlotResult = destinationItemSlot(target, destinationIndex);
            if (sourceItemSlotResult === undefined) {
                continue;
            }

            if (!(sourceItemSlotResult instanceof ContainerSlot)) {
                return sourceItemSlotResult;
            }

            moveItemAtSlot(sourceItemSlotResult, destinationItemSlotResult, moveMode, replaceItem);
            commandSuccess = true;
        }

        if (!commandSuccess) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Failed to move items between containers",
            };
        }

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully moved items between containers",
        };
    }
);
