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
    Entity,
    ContainerSlot,
    CustomCommandResult,
    EquipmentSlot,
    CustomCommandStatus,
    EntityEnderInventoryComponent,
    EntityInventoryComponent,
} from "@minecraft/server";

import { EnumManager } from "../enum.js";

type ItemLocationResolver = (
    entity: Entity,
    index: number
) => ContainerSlot | CustomCommandResult | undefined;
export const ITEM_LOCATIONS_ENUM_KEY = "itemLocationsEnum";

// TODO START LOCALISING THESE COMMON UTILITIES LIKE RAWTEXT PARSING, SLOT RESOLVING, MATH RESOLVING, ETC. TO THEIR OWN FILES IN A FOLDER
export const ItemLocations: Record<string, ItemLocationResolver> = {
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

    "slot.inventory": (
        entity: Entity,
        index: number
    ): ContainerSlot | CustomCommandResult | undefined =>
        getSizeableContainerSlot("inventory", entity, index, 9),

    "slot.chest": (
        entity: Entity,
        index: number
    ): ContainerSlot | CustomCommandResult | undefined =>
        getSizeableContainerSlot("inventory", entity, index),

    "slot.enderchest": (
        entity: Entity,
        index: number
    ): ContainerSlot | CustomCommandResult | undefined =>
        getSizeableContainerSlot("minecraft:ender_chest", entity, index),

    "slot.hotbar": (
        entity: Entity,
        index: number
    ): ContainerSlot | CustomCommandResult | undefined => {
        if (index > 8 || index < 0) {
            return {
                status: CustomCommandStatus.Failure,
                message: "Index must be between 0 and 8",
            };
        }

        return entity.getComponent("inventory")?.container.getSlot(index);
    },

    // "slot.cursor": (entity: Entity, _: number): ContainerSlot | undefined => entity.getComponent("minecraft:cursor_inventory")?.,
};

EnumManager.register(ITEM_LOCATIONS_ENUM_KEY, Object.keys(ItemLocations));

function getSizeableContainerSlot(
    containerId: string,
    entity: Entity,
    index: number,
    offset: number = 0
): ContainerSlot | CustomCommandResult | undefined {
    const container = (
        entity.getComponent(containerId) as EntityInventoryComponent | EntityEnderInventoryComponent
    )?.container;
    if (!container) {
        return {
            status: CustomCommandStatus.Failure,
            message: "The target entity does not have this type of inventory",
        };
    }

    const containerSize = container.size - offset - 1;

    if (index > containerSize || index < 0) {
        return {
            status: CustomCommandStatus.Failure,
            message: "Index must be between 0 and " + containerSize,
        };
    }

    return container.getSlot(index + offset);
}
