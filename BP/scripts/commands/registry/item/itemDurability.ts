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
import {
    VALUE_UPDATE_MODE_ENUM_KEY,
    ValueUpdateMode,
} from "../../../enums/registry/valueUpdateMode.js";
import { clamp } from "../../../utils/math.js";
import { CommandManager } from "../../command.js";

CommandManager.register(
    {
        name: "itemdurability",
        description:
            "Modifies the durability of the item at the provided slot within an entity's inventory",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.PlayerSelector },
            {
                name: "mode",
                type: CustomCommandParamType.Enum,
                enumName: VALUE_UPDATE_MODE_ENUM_KEY,
            },
            { name: "slot", type: CustomCommandParamType.Enum, enumName: ITEM_LOCATIONS_ENUM_KEY },
            { name: "index", type: CustomCommandParamType.Integer },
            { name: "value", type: CustomCommandParamType.Integer },
        ],
    },
    (_, targets: Entity[], mode: ValueUpdateMode, slot: string, index: number, amount: number) => {
        const itemSlot = ItemLocations[slot];
        if (!itemSlot) {
            return { status: CustomCommandStatus.Failure, message: "Invalid item slot" };
        }

        if (!ValueUpdateMode[mode]) {
            return { status: CustomCommandStatus.Failure, message: "Invalid value update mode" };
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

            updateItemDurabilityAtSlot(item, itemSlotResult, mode, amount);
            commandSuccess = true;
        }

        if (!commandSuccess) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Failed to modify durability of item at slot",
            };
        }

        return {
            status: CustomCommandStatus.Success,
            message: "Successfully modified durability of item at slot",
        };
    }
);

export function updateItemDurabilityAtSlot(
    item: ItemStack,
    itemSlot: ContainerSlot,
    mode: ValueUpdateMode,
    amount: number
): void {
    system.run(() => {
        const durability = item.getComponent("minecraft:durability");
        if (durability === undefined) {
            return;
        }

        switch (mode) {
            case ValueUpdateMode.set:
                durability.damage = clamp(amount, 0, durability.maxDurability);
                break;

            case ValueUpdateMode.add:
                durability.damage = clamp(durability.damage + amount, 0, durability.maxDurability);
                break;

            case ValueUpdateMode.remove:
                durability.damage = clamp(durability.damage - amount, 0, durability.maxDurability);
                break;
        }

        itemSlot.setItem(item);
    });
}
