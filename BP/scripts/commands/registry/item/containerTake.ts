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
    Entity,
    ContainerSlot,
} from "@minecraft/server";

import { BLOCK_ITEM_LOCATIONS_ENUM_KEY } from "../../../enums/registry/blockItemLocation.js";
import { ItemLocations } from "../../../enums/registry/itemLocations.js";
import { ITEM_MOVE_MODE_ENUM_KEY, ItemMoveMode } from "../../../enums/registry/itemMoveMode.js";
import { CommandManager } from "../../command.js";
import { getBlockContainerSlot } from "./blockItemName.js";
import { moveItemAtSlot } from "./itemMove.js";

CommandManager.register(
    {
        name: "containertake",
        description:
            "Move an item from a slot within a block container to a slot within an entity's inventory",
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
