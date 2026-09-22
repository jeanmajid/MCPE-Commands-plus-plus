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
    EquipmentSlot,
    EntityInventoryComponent,
    EntityEnderInventoryComponent,
    system,
} from "@minecraft/server";

import { CommandManager } from "../../command.js";

const ITEM_LOCATIONS_ENUM_KEY = "itemLocationsEnum";
type ItemLocationResolver = (entity: Entity, index: number) => ContainerSlot | string | undefined;

// TODO START LOCALISING THESE COMMON UTILITIES LIKE RAWTEXT PARSING, SLOT RESOLVING, MATH RESOLVING, ETC. TO THEIR OWN FILES IN A FOLDER
const ItemLocations: Record<string, ItemLocationResolver> = {
    "slot.weapon.mainhand": (entity: Entity, _index: number): ContainerSlot | undefined =>
        entity.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Mainhand),

    "slot.weapon.offhand": (entity: Entity, _index: number): ContainerSlot | undefined =>
        entity.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Offhand),

    "slot.armor.head": (entity: Entity, _index: number): ContainerSlot | undefined =>
        entity.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Head),

    "slot.armor.body": (entity: Entity, _index: number): ContainerSlot | undefined =>
        entity.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Body),

    "slot.armor.chest": (entity: Entity, _index: number): ContainerSlot | undefined =>
        entity.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Chest),

    "slot.armor.legs": (entity: Entity, _index: number): ContainerSlot | undefined =>
        entity.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Legs),

    "slot.armor.feet": (entity: Entity, _index: number): ContainerSlot | undefined =>
        entity.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Feet),

    "slot.inventory": (entity: Entity, index: number): ContainerSlot | string | undefined =>
        getSizeableContainerSlot("inventory", entity, index),

    "slot.chest": (entity: Entity, index: number): ContainerSlot | string | undefined =>
        getSizeableContainerSlot("inventory", entity, index),

    "slot.enderchest": (entity: Entity, index: number): ContainerSlot | string | undefined =>
        getSizeableContainerSlot("minecraft:ender_chest", entity, index),

    "slot.hotbar": (entity: Entity, index: number): ContainerSlot | string | undefined => {
        if (index > 8 || index < 0) {
            return "Index must be between 0 and 8";
        }

        return entity.getComponent("inventory")?.container.getSlot(index);
    },

    // "slot.cursor": (entity: Entity, _: number): ContainerSlot | undefined => entity.getComponent("minecraft:cursor_inventory")?.,
};

CommandManager.registerEnum(ITEM_LOCATIONS_ENUM_KEY, Object.keys(ItemLocations));

CommandManager.registerCommand(
    {
        name: "itemname",
        description: "Renames the item at the provided location within an entity's inventory",
        permissionLevel: CommandPermissionLevel.GameDirectors,
        mandatoryParameters: [
            { name: "targets", type: CustomCommandParamType.PlayerSelector },
            { name: "slot", type: CustomCommandParamType.Enum, enumName: ITEM_LOCATIONS_ENUM_KEY },
            { name: "index", type: CustomCommandParamType.Integer },
            { name: "name", type: CustomCommandParamType.String },
        ],
    },
    (origin, targets: Entity[], slot: string, index: number, name: string) => {
        if (!(slot in ItemLocations)) {
            return { status: CustomCommandStatus.Failure, message: "Invalid item slot" };
        }

        if (targets.length === 0) {
            return { status: CustomCommandStatus.Failure, message: "No targets match selector" };
        }

        for (const target of targets) {
            const itemLocationResult = ItemLocations[slot](target, index);

            if (itemLocationResult === undefined) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Cannot access item location on this entity",
                };
            }

            if (typeof itemLocationResult === "string") {
                return { status: CustomCommandStatus.Failure, message: itemLocationResult };
            }

            const item = itemLocationResult.getItem();

            if (!item) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "No item found at the slot",
                };
            }

            system.run(() => {
                item.nameTag = name;
                itemLocationResult.setItem(item);
            });

            return {
                status: CustomCommandStatus.Success,
                message: "Successfully renamed item at slot",
            };
        }
    }
);

function getSizeableContainerSlot(
    containerId: string,
    entity: Entity,
    index: number
): ContainerSlot | string | undefined {
    const container = (
        entity.getComponent(containerId) as EntityInventoryComponent | EntityEnderInventoryComponent
    )?.container;
    if (!container) {
        return "The target entity does not have this type of inventory";
    }

    if (index > container.size || index < 0) {
        return "Index must be between 0 and " + container.size;
    }

    return container.getSlot(index);
}
