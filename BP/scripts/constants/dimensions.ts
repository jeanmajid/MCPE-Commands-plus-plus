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

import { Dimension } from "@minecraft/server";

import { NAMESPACE } from "./namespace";

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
