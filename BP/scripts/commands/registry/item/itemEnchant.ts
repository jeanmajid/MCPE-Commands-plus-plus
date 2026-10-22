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
    EnchantmentType,
    ItemStack,
} from "@minecraft/server";

import { ENCHANTMENT_ENUM_KEY } from "../../../enums/registry/enchantment.js";
import { ITEM_LOCATIONS_ENUM_KEY, ItemLocations } from "../../../enums/registry/itemLocations.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "itemenchant",
        description: "Enchants the item at the provided slot within an entity's inventory",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.PlayerSelector },
            { name: "slot", type: CustomCommandParamType.Enum, enumName: ITEM_LOCATIONS_ENUM_KEY },
            { name: "index", type: CustomCommandParamType.Integer },
            { name: "enchant", type: CustomCommandParamType.Enum, enumName: ENCHANTMENT_ENUM_KEY },
        ],
        optionalParameters: [{ name: "level", type: CustomCommandParamType.Integer }],
    },
    (_, targets: Entity[], slot: string, index: number, enchant: string, level: number = 1) => {
        const itemSlot = ItemLocations[slot];
        if (!itemSlot) {
            return { status: CustomCommandStatus.Failure, message: "Invalid item slot" };
        }

        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        let commandSuccess = false;
        for (const target of targets) {
            const itemSlotResult = itemSlot(target, index);

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

            enchantItemAtSlot(item, itemSlotResult, enchant, level);
            commandSuccess = true;
        }

        if (!commandSuccess) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Failed to enchant item at slot",
            };
        }

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully enchanted item at slot",
        };
    }
);

export function enchantItemAtSlot(
    item: ItemStack,
    itemSlot: ContainerSlot,
    enchant: string,
    level: number
): void {
    system.run(() => {
        try {
            item.getComponent("minecraft:enchantable")?.addEnchantment({
                type: new EnchantmentType(enchant),
                level: level,
            });
        } catch {
            return;
        }
        itemSlot.setItem(item);
    });
}
