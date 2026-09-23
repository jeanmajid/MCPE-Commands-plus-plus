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
    EnchantmentType,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";
import { ITEM_LOCATIONS_ENUM_KEY, ItemLocations } from "./itemName.js";

CommandManager.registerCommand(
    {
        name: "itemname",
        description: "Renames the item at the provided location within an entity's inventory",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.PlayerSelector },
            { name: "slot", type: CustomCommandParamType.Enum, enumName: ITEM_LOCATIONS_ENUM_KEY },
            { name: "index", type: CustomCommandParamType.Integer },
            { name: "enchant", type: CustomCommandParamType.String },
        ],
        optionalParameters: [{ name: "level", type: CustomCommandParamType.Integer }],
    },
    (_, targets: Entity[], slot: string, index: number, enchant: string, level: number) => {
        if (!(slot in ItemLocations)) {
            return { status: CustomCommandStatus.Failure, message: "Invalid item slot" };
        }

        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        for (const target of targets) {
            const itemSlotResult = ItemLocations[slot](target, index);

            if (itemSlotResult === undefined) {
                continue;
            }

            if (!(itemSlotResult instanceof ContainerSlot)) {
                return itemSlotResult;
            }

            const item = itemSlotResult.getItem();

            if (!item) {
                continue;
            }

            system.run(() => {
                try {
                    item.getComponent("minecraft:enchantable")?.addEnchantment({
                        type: new EnchantmentType(enchant),
                        level: level,
                    });
                } catch {
                    return;
                }
                itemSlotResult.setItem(item);
            });
        }

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully enchanted item at slot",
        };
    }
);
