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
