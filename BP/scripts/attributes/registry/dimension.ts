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
    public id = "dimension";
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

AttributeManager.register(new DimensionAttribute());
