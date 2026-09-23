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
    InputMode,
    PlayerInputModeChangeAfterEvent,
    ScoreboardObjective,
    world,
} from "@minecraft/server";

import { AttributeManager, BaseAttribute } from "../attribute.js";

const inputModeIndex = {
    [InputMode.Gamepad]: 0,
    [InputMode.KeyboardAndMouse]: 1,
    [InputMode.MotionController]: 2,
    [InputMode.Touch]: 3,
};

class InputModeAttribute extends BaseAttribute {
    public id = "inputMode";
    public event?: (arg0: PlayerInputModeChangeAfterEvent) => void;

    public initialize(): void {
        this.setValues(this.score);

        this.event = world.afterEvents.playerInputModeChange.subscribe(
            ({ player, newInputModeUsed }) => {
                this.score.setScore(player, inputModeIndex[newInputModeUsed]);
            }
        );
    }

    public setValues(score: ScoreboardObjective): void {
        for (const player of world.getAllPlayers()) {
            const inputMode = player.inputInfo.lastInputModeUsed;

            score.setScore(player, inputModeIndex[inputMode]);
        }
    }

    public cleanup(): void {
        world.afterEvents.playerInputModeChange.unsubscribe(this.event!);
    }
}

AttributeManager.registerAttribute(new InputModeAttribute());
