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

import { ScoreboardObjective, world } from "@minecraft/server";

export abstract class BaseAttribute {
    public abstract id: string;
    public isBinded: boolean = false;
    public score!: ScoreboardObjective;
    public selector?: string;
    /**
     * Function to initiate all your events or runIntervals
     */
    public abstract initialize(): void;
    /**
     * Function to clear up all your events or runIntervals
     */
    public abstract cleanup(): void;
}

export class AttributeManager {
    public static attributes: BaseAttribute[] = [];

    public static registerAttribute(attribute: BaseAttribute): void {
        this.attributes.push(attribute);
    }

    public static getAttribute(id: string): BaseAttribute | undefined {
        return this.attributes.find((attribute) => attribute.id === id);
    }

    public static loadAttributesFromMemory(): void {
        for (const propertyId of world.getDynamicPropertyIds()) {
            if (!propertyId.startsWith("attribute:")) {
                continue;
            }

            const attributeId = propertyId.replace("attribute:", "");
            const attribute = this.getAttribute(attributeId);
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
            attribute.initialize();
        }
    }
}
