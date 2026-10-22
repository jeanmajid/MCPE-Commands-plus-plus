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
    ContainerSlot,
    Entity,
    system,
    ItemStack,
} from "@minecraft/server";

import { ITEM_LOCATIONS_ENUM_KEY, ItemLocations } from "../../../enums/registry/itemLocations.js";
import { ITEM_MOVE_MODE_ENUM_KEY, ItemMoveMode } from "../../../enums/registry/itemMoveMode.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "itemmove",
        description: "Moves an item from one provided slot within an entity's inventory to another",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.PlayerSelector },
            { name: "slot", type: CustomCommandParamType.Enum, enumName: ITEM_LOCATIONS_ENUM_KEY },
            { name: "index", type: CustomCommandParamType.Integer },
            {
                name: "destinationSlot",
                type: CustomCommandParamType.Enum,
                enumName: ITEM_LOCATIONS_ENUM_KEY,
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
        _,
        targets: Entity[],
        sourceSlot: string,
        sourceIndex: number,
        destinationSlot: string,
        destinationIndex: number,
        moveMode: ItemMoveMode = ItemMoveMode.move,
        replaceItem: boolean = true
    ) => {
        const sourceItemSlot = ItemLocations[sourceSlot];
        if (!sourceItemSlot) {
            return { status: CustomCommandStatus.Failure, message: "Invalid source item slot" };
        }

        const destinationItemSlot = ItemLocations[destinationSlot];
        if (!destinationItemSlot) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Invalid destination item slot",
            };
        }

        if (!ItemMoveMode[moveMode]) {
            return { status: CustomCommandStatus.Failure, message: "Invalid item move mode" };
        }

        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        let commandSuccess = false;
        for (const target of targets) {
            const sourceItemSlotResult = sourceItemSlot(target, sourceIndex);
            if (sourceItemSlotResult === undefined) {
                continue;
            }
            const destinationItemSlotResult = destinationItemSlot(target, destinationIndex);
            if (destinationItemSlotResult === undefined) {
            }

            if (!(sourceItemSlotResult instanceof ContainerSlot)) {
                return sourceItemSlotResult;
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
                message: "Failed to move item between slots",
            };
        }

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully moved item between slots",
        };
    }
);

//* Could optimise this by evaluating the switch once before the for loop
export function moveItemAtSlot(
    sourceItemSlot: ContainerSlot,
    destinationItemSlot: ContainerSlot,
    moveMode: ItemMoveMode,
    replaceItem: boolean
): void {
    system.run(() => {
        const sourceItem = sourceItemSlot.getItem();
        let destinationItem: undefined | null | ItemStack = null;

        if (moveMode === ItemMoveMode.swap) {
            destinationItem = destinationItemSlot.getItem();

            sourceItemSlot.setItem(destinationItem);
            destinationItemSlot.setItem(sourceItem);
            return;
        }

        if (!replaceItem) {
            destinationItem = destinationItemSlot.getItem();

            if (destinationItem) {
                return;
            }
        }

        if (moveMode === ItemMoveMode.move) {
            sourceItemSlot.setItem(undefined);
            destinationItemSlot.setItem(sourceItem);
            return;
        }

        //? Copy
        destinationItemSlot.setItem(sourceItem);
    });
}
