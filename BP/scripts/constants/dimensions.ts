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

import { Dimension } from "@minecraft/server";

import { NAMESPACE } from "./namespace.js";

export const CUSTOM_DIMENSIONS = ["dimension1", "dimension2", "dimension3"];

// TODO: this should have the custom dimensions aswell, but would love to do only iterate over the actual active ones, maybe dimension switch?
export const Dimensions = {
    overworld: undefined as unknown as Dimension,
    nether: undefined as unknown as Dimension,
    end: undefined as unknown as Dimension,
    dimension1: undefined as unknown as Dimension,
    dimension2: undefined as unknown as Dimension,
    dimension3: undefined as unknown as Dimension,
    all: undefined as unknown as Dimension[],
};

export enum DimensionIds {
    overworld = "overworld",
    nether = "nether",
    end = "end",
    dimension1 = NAMESPACE + "dimension1",
    dimension2 = NAMESPACE + "dimension2",
    dimension3 = NAMESPACE + "dimension3",
}
