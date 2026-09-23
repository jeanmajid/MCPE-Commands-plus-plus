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
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { ITEM_LOCATIONS_ENUM_KEY, ItemLocations } from "./itemName.js";

const ITEM_MOVE_MODE_ENUM_KEY = "itemMoveMode";
enum ItemMoveMode {
    swap = "swap",
    copy = "copy",
    keep = "keep",
    move = "move",
}

CommandManager.registerEnum(ITEM_MOVE_MODE_ENUM_KEY, Object.values(ItemMoveMode));

CommandManager.registerCommand(
    {
        name: "itemdurability",
        description:
            "Moves an item from one provided location within an entity's inventory to another",
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
        ],
    },
    (
        _,
        targets: Entity[],
        sourceSlot: string,
        sourceIndex: number,
        destinationSlot: string,
        destinationIndex: number,
        moveMode: ItemMoveMode = ItemMoveMode.move
    ) => {
        if (!(sourceSlot in ItemLocations)) {
            return { status: CustomCommandStatus.Failure, message: "Invalid item slot" };
        }

        if (!(moveMode in ItemMoveMode)) {
            return { status: CustomCommandStatus.Failure, message: "Invalid item move mode" };
        }

        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

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

            const sourceItem = sourceItemSlotResult.getItem();

            system.run(() => {
                switch (moveMode) {
                    case ItemMoveMode.move:
                        sourceItemSlotResult.setItem(undefined);
                        destinationItemSlotResult.setItem(sourceItem);
                        break;

                    case ItemMoveMode.swap: {
                        const destinationItem = destinationItemSlotResult.getItem();

                        sourceItemSlotResult.setItem(destinationItem);
                        destinationItemSlotResult.setItem(sourceItem);
                        break;
                    }

                    case ItemMoveMode.copy:
                        destinationItemSlotResult.setItem(sourceItem);
                        break;

                    case ItemMoveMode.keep: {
                        const destinationItem = destinationItemSlotResult.getItem();
                        if (destinationItem !== undefined) {
                            break;
                        }

                        sourceItemSlotResult.setItem(undefined);
                        destinationItemSlotResult.setItem(sourceItem);
                        break;
                    }
                }
            });
        }

        return { status: CustomCommandStatus.Success, message: "Successfully moved item to slot" };
    }
);
