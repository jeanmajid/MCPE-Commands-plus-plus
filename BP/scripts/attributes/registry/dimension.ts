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

import { PlayerDimensionChangeAfterEvent, ScoreboardObjective, world } from "@minecraft/server";

import { DimensionIds } from "../../constants/dimensions.js";
import { AttributeManager, BaseAttribute } from "../attribute.js";

const dimensionIndex: Record<string, number> = {
    [DimensionIds.overworld]: 0,
    [DimensionIds.nether]: 1,
    [DimensionIds.end]: 2,
    [DimensionIds.dimension1]: 3,
    [DimensionIds.dimension2]: 4,
    [DimensionIds.dimension3]: 5,
};

class DimensionAttribute extends BaseAttribute {
    public id = "permissionlevel";
    public event?: (arg0: PlayerDimensionChangeAfterEvent) => void;

    public initialize(): void {
        this.setValues(this.score);

        this.event = world.afterEvents.playerDimensionChange.subscribe(
            ({ player, toDimension }) => {
                this.score.setScore(player, dimensionIndex[toDimension.id]);
            }
        );
    }

    public setValues(score: ScoreboardObjective): void {
        for (const player of world.getAllPlayers()) {
            score.setScore(player, dimensionIndex[player.dimension.id]);
        }
    }

    public cleanup(): void {
        world.afterEvents.playerDimensionChange.unsubscribe(this.event!);
    }
}

AttributeManager.registerAttribute(new DimensionAttribute());
