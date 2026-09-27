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
    CustomCommandOrigin,
    Dimension,
    Entity,
    EntityQueryOptions,
    system,
    world,
} from "@minecraft/server";

import { CUSTOM_DIMENSIONS, Dimensions } from "../constants/dimensions.js";
import { NAMESPACE } from "../constants/namespace.js";

export function registerCustomDimensions(): void {
    const event = system.beforeEvents.startup.subscribe((data) => {
        for (let dimensionId of CUSTOM_DIMENSIONS) {
            if (!dimensionId.startsWith(NAMESPACE)) {
                dimensionId = NAMESPACE + dimensionId;
            }
            data.dimensionRegistry.registerCustomDimension(dimensionId);
        }

        system.beforeEvents.startup.unsubscribe(event);
    });
}

export function initializeDimensions(): void {
    Dimensions.overworld = world.getDimension("overworld");
    Dimensions.nether = world.getDimension("nether");
    Dimensions.end = world.getDimension("the_end");
    Dimensions.dimension1 = world.getDimension(NAMESPACE + "dimension1");
    Dimensions.dimension2 = world.getDimension(NAMESPACE + "dimension2");
    Dimensions.dimension3 = world.getDimension(NAMESPACE + "dimension3");
    Dimensions.all = [
        Dimensions.overworld,
        Dimensions.nether,
        Dimensions.end,
        Dimensions.dimension1,
        Dimensions.dimension2,
        Dimensions.dimension3,
    ];
}

/**
 * Gets all entities from all dimensions
 */
export function getAllEntities(filter?: EntityQueryOptions): Entity[] {
    return Dimensions.all.flatMap((d) => d.getEntities(filter));
}

export function getDimensionFromCommandOrigin(origin: CustomCommandOrigin): Dimension {
    if (origin.sourceEntity) {
        return origin.sourceEntity.dimension;
    } else if (origin.sourceBlock) {
        return origin.sourceBlock.dimension;
    } else if (origin.initiator) {
        return origin.initiator.dimension;
    } else {
        return Dimensions.overworld;
    }
}
