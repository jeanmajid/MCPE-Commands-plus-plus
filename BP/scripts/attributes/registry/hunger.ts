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

import { ScoreboardObjective, system, world } from "@minecraft/server";

import { AttributeManager, BaseAttribute } from "../attribute.js";

class HungerAttribute extends BaseAttribute {
    public id = "hunger";
    public runId = -1;

    public initialize(): void {
        this.runId = system.runInterval(() => {
            this.setValues(this.score);
        }, 1);
    }

    public setValues(score: ScoreboardObjective): void {
        for (const player of world.getAllPlayers()) {
            const hunger = player.getComponent("player.hunger")?.currentValue ?? 0;

            score.setScore(player, hunger);
        }
    }

    public cleanup(): void {
        system.clearRun(this.runId);
    }
}

AttributeManager.register(new HungerAttribute());
