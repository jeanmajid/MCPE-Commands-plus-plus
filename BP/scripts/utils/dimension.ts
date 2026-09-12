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
    world,
} from "@minecraft/server";

import { Dimensions } from "../constants/dimensions";

export function initializeDimensions(): void {
    Dimensions.overworld = world.getDimension("overworld");
    Dimensions.nether = world.getDimension("nether");
    Dimensions.end = world.getDimension("the_end");
    Dimensions.all = [Dimensions.overworld, Dimensions.nether, Dimensions.end];
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
