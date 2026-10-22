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

import { ScoreboardObjective, world } from "@minecraft/server";

import { Dimensions } from "../constants/dimensions.js";
import { ATTRIBUTE_KEY } from "../constants/dynamicPropertyKeys.js";
import { EnumManager } from "../enums/enum.js";

// TODO: Clear all scores on join, so score doesn't fill up

export abstract class BaseAttribute {
    public abstract id: string;
    public isBinded: boolean = false; //isBound
    public score!: ScoreboardObjective;
    /**
     * Function to initiate all your events or runIntervals
     */
    public abstract initialize(): void;
    /**
     * Function to set the values once
     */
    public abstract setValues(score: ScoreboardObjective): void;
    /**
     * Function to clear up all your events or runIntervals
     */
    public abstract cleanup(): void;
}

export class AttributeManager {
    public static attributes: Record<string, BaseAttribute> = {};

    public static register(attribute: BaseAttribute): void {
        if (this.get(attribute.id)) {
            console.error("Duplicate attribute registered: " + attribute.id);
        }
        this.attributes[attribute.id] = attribute;
    }

    public static get(id: string): BaseAttribute | undefined {
        return this.attributes[id];
    }

    public static loadAttributesFromMemory(): void {
        for (const propertyId of world.getDynamicPropertyIds()) {
            if (!propertyId.startsWith(ATTRIBUTE_KEY)) {
                continue;
            }

            const attributeId = propertyId.substring(ATTRIBUTE_KEY.length);
            const attribute = this.get(attributeId);
            if (!attribute) {
                console.warn(
                    `ERROR: cannot find attribute ${attributeId}, which is found in storage... Deleting`
                );
                world.setDynamicProperty(propertyId, undefined);
                continue;
            }

            const scoreboardId = world.getDynamicProperty(propertyId) as string;

            attribute.isBinded = true;
            attribute.score =
                world.scoreboard.getObjective(scoreboardId) ??
                world.scoreboard.addObjective(scoreboardId);
            Dimensions.overworld.runCommand(`scoreboard players reset * ${scoreboardId}`);
            attribute.initialize();
        }
    }

    /**
     * Only should be called once after all attributes are registered in the before world load enviroment
     */
    public static initialize(): void {
        EnumManager.register(ATTRIBUTE_KEY, Object.keys(AttributeManager.attributes));
    }
}
