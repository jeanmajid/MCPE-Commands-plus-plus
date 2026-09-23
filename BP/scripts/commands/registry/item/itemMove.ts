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
    ContainerSlot,
    Entity,
    system,
    ItemStack,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { ITEM_LOCATIONS_ENUM_KEY, ItemLocations } from "./itemName.js";

export const ITEM_MOVE_MODE_ENUM_KEY = "itemMoveMode";
export enum ItemMoveMode {
    swap = "swap",
    copy = "copy",
    move = "move",
}

CommandManager.registerEnum(ITEM_MOVE_MODE_ENUM_KEY, Object.values(ItemMoveMode));

CommandManager.registerCommand(
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
        if (!ItemLocations[sourceSlot]) {
            return { status: CustomCommandStatus.Failure, message: "Invalid source item slot" };
        }

        if (!ItemLocations[destinationSlot]) {
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

        const commandSuccess = false;

        for (const target of targets) {
            const sourceItemSlotResult = ItemLocations[sourceSlot](target, sourceIndex);
            const destinationItemSlotResult = ItemLocations[destinationSlot](
                target,
                destinationIndex
            );

            if (sourceItemSlotResult === undefined || destinationItemSlotResult === undefined) {
                continue;
            }

            if (!(sourceItemSlotResult instanceof ContainerSlot)) {
                return sourceItemSlotResult;
            }

            if (!(destinationItemSlotResult instanceof ContainerSlot)) {
                return destinationItemSlotResult;
            }

            moveItemAtSlot(sourceItemSlotResult, destinationItemSlotResult, moveMode, replaceItem);
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
