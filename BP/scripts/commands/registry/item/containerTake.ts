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
            { name: "sourceLocation", type: CustomCommandParamType.Location },
            {
                name: "sourceSlot",
                type: CustomCommandParamType.Enum,
                enumName: BLOCK_ITEM_LOCATIONS_ENUM_KEY,
            },
            { name: "sourceIndex", type: CustomCommandParamType.Integer },
            { name: "destinationEntity", type: CustomCommandParamType.EntitySelector },
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
        sourceLocation: Vector3,
        sourceSlot: string,
        sourceIndex: number,
        destinationEntity: Entity[],
        destinationSlot: string,
        destinationIndex: number,
        moveMode: ItemMoveMode,
        replaceItem: boolean
    ) => {
        if (destinationEntity.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        const sourceItemSlotResult = getBlockContainerSlot(
            origin,
            sourceLocation,
            sourceSlot,
            sourceIndex
        );

        if (!(sourceItemSlotResult instanceof ContainerSlot)) {
            return sourceItemSlotResult;
        }

        const destinationItemSlot = ItemLocations[destinationSlot];
        if (!destinationItemSlot) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Invalid destination item slot",
            };
        }

        let commandSuccess = false;
        for (const target of destinationEntity) {
            const destinationItemSlotResult = destinationItemSlot(target, destinationIndex);
            if (destinationItemSlotResult === undefined) {
                continue;
            }

            if (!(destinationItemSlotResult instanceof ContainerSlot)) {
                return destinationItemSlotResult;
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
