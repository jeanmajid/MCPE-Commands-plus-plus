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
    CustomCommandOrigin,
    Dimension,
    Entity,
    EntityQueryOptions,
    system,
    world,
    Vector3,
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

// TODO move into dedicated WorldLoader class in the future (https://github.com/jeanmajid/MCPE-Commands-plus-plus/issues/118)
export async function loadArea(
    dimension: Dimension,
    start: Vector3,
    end: Vector3,
    discardInTicks: number = 5
): Promise<void> {
    const tickingAreaManager = world.tickingAreaManager;

    const tickingAreaID = `${Date.now()};${Math.floor(Math.random() * 9999)}`;
    await tickingAreaManager.createTickingArea(tickingAreaID, {
        dimension: dimension,
        from: start,
        to: end,
    });

    system.runTimeout(() => {
        tickingAreaManager.removeTickingArea(tickingAreaID);
    }, discardInTicks);
}
