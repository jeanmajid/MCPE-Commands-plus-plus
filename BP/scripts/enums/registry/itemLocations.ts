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
    Entity,
    ContainerSlot,
    CustomCommandResult,
    EquipmentSlot,
    CustomCommandStatus,
    EntityEnderInventoryComponent,
    EntityInventoryComponent,
    Player,
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
        getSizeableContainerSlot("inventory", entity, index, entity instanceof Player ? 9 : 0),

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
